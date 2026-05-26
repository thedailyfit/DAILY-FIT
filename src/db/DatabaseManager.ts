import { Pool, PoolClient } from 'pg';

// C-02: Whitelist of allowed table names to prevent SQL injection
const ALLOWED_TABLES = new Set([
    'members',
    'trainers',
    'meal_plans',
    'workout_plans',
    'conversations',
    'chat_history',
    'whatsapp_connections',
    'whatsapp_proxy_sessions',
    'gyms',
    'leads',
    'diet_templates',
    'workout_templates',
    'subscriptions',
    'weight_checkins',
    'staff',
    'trainer_schedule',
    'change_logs',
    'referrals',
    'client_notifications',
    'support_tickets',
    'payments',
    'client_programs',
    'plan_programs',
]);

// C-02: Validate that a string is a safe SQL identifier (table or column name)
function assertSafeIdentifier(name: string, type: 'table' | 'column'): void {
    // Only allow alphanumeric characters and underscores
    if (!/^[a-z_][a-z0-9_]*$/i.test(name)) {
        throw new Error(`Invalid ${type} name: "${name}" — contains illegal characters`);
    }
    if (name.length > 63) {
        throw new Error(`Invalid ${type} name: "${name}" — too long (max 63 chars)`);
    }
}

function assertAllowedTable(table: string): void {
    assertSafeIdentifier(table, 'table');
    if (!ALLOWED_TABLES.has(table)) {
        throw new Error(
            `Table "${table}" is not in the allowed tables whitelist. ` +
            `Add it to ALLOWED_TABLES in DatabaseManager.ts if this is intentional.`
        );
    }
}

// Quote a SQL identifier safely
function quoteIdent(name: string): string {
    assertSafeIdentifier(name, 'column');
    return `"${name}"`;
}

// C-05: Singleton pool instance — shared across all DatabaseManager instances
let sharedPool: Pool | null = null;

function getPool(): Pool | null {
    if (sharedPool) return sharedPool;

    if (process.env.DATABASE_URL) {
        sharedPool = new Pool({
            connectionString: process.env.DATABASE_URL,
            // H-09: Proper SSL configuration
            ssl: process.env.NODE_ENV === 'production'
                ? { rejectUnauthorized: true }
                : false,
            // Connection pool limits
            max: 20,
            min: 2,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 10000,
        });

        // L-10: Handle pool errors gracefully
        sharedPool.on('error', (err) => {
            console.error('Unexpected database pool error:', err);
        });

        console.log('📊 PostgreSQL connection pool initialized');
    }

    return sharedPool;
}

export class DatabaseManager {
    private pool: Pool | null;

    constructor() {
        // C-05: Use singleton pool instead of creating new pool per instance
        this.pool = getPool();

        if (!this.pool) {
            console.log('📁 DATABASE_URL not set, using JSON files');
        }
    }

    // M-01: Parameterized read with proper WHERE clause
    async read<T>(table: string, query?: { [key: string]: any }): Promise<T[]> {
        assertAllowedTable(table);

        if (this.pool) {
            if (query && Object.keys(query).length > 0) {
                const keys = Object.keys(query);
                const values = Object.values(query);
                keys.forEach(k => assertSafeIdentifier(k, 'column'));
                const whereClause = keys.map((k, i) => `${quoteIdent(k)} = $${i + 1}`).join(' AND ');
                const result = await this.pool.query(
                    `SELECT * FROM ${quoteIdent(table)} WHERE ${whereClause}`,
                    values
                );
                return result.rows;
            } else {
                const result = await this.pool.query(`SELECT * FROM ${quoteIdent(table)}`);
                return result.rows;
            }
        } else {
            // Fallback to JSON files
            const fs = await import('fs-extra');
            const path = await import('path');
            const filePath = path.join(process.cwd(), 'data', `${table}.json`);
            if (await fs.pathExists(filePath)) {
                let items = await fs.readJson(filePath);
                if (query) {
                    items = items.filter((item: any) => {
                        return Object.entries(query).every(([k, v]) => item[k] === v);
                    });
                }
                return items;
            }
            return [];
        }
    }

    // M-01: Parameterized lookup for a single record by specific conditions
    async findByColumn<T>(table: string, column: string, value: any): Promise<T[]> {
        assertAllowedTable(table);
        assertSafeIdentifier(column, 'column');

        if (this.pool) {
            const result = await this.pool.query(
                `SELECT * FROM ${quoteIdent(table)} WHERE ${quoteIdent(column)} = $1`,
                [value]
            );
            return result.rows;
        } else {
            return this.read<T>(table, { [column]: value });
        }
    }

    async findOne<T>(table: string, query: { [key: string]: any }): Promise<T | undefined> {
        const items = await this.read<T>(table, query);
        return items[0];
    }

    async upsert<T extends { [key: string]: any }>(
        table: string,
        data: T,
        uniqueKey: string
    ): Promise<void> {
        assertAllowedTable(table);
        assertSafeIdentifier(uniqueKey, 'column');

        if (this.pool) {
            // PostgreSQL upsert with safe identifiers
            const keys = Object.keys(data).filter(k => data[k] !== undefined);
            keys.forEach(k => assertSafeIdentifier(k, 'column'));

            const values = keys.map(k => {
                const value = data[k];
                // Convert arrays and objects to JSON
                if (Array.isArray(value) || (typeof value === 'object' && value !== null && !(value instanceof Date))) {
                    return JSON.stringify(value);
                }
                return value;
            });

            const quotedKeys = keys.map(k => quoteIdent(k));
            const placeholders = keys.map((_, i) => `$${i + 1}`);
            const updateSet = keys
                .filter(k => k !== uniqueKey) // Don't update the unique key itself
                .map(k => `${quoteIdent(k)} = EXCLUDED.${quoteIdent(k)}`)
                .join(', ');

            const sql = `
                INSERT INTO ${quoteIdent(table)} (${quotedKeys.join(', ')})
                VALUES (${placeholders.join(', ')})
                ON CONFLICT (${quoteIdent(uniqueKey)})
                DO UPDATE SET ${updateSet}
            `;

            await this.pool.query(sql, values);
        } else {
            // Fallback to JSON files
            const fs = await import('fs-extra');
            const path = await import('path');
            const filePath = path.join(process.cwd(), 'data', `${table}.json`);

            let items: T[] = [];
            if (await fs.pathExists(filePath)) {
                items = await fs.readJson(filePath);
            }

            const index = items.findIndex((item: any) => item[uniqueKey] === data[uniqueKey]);
            if (index >= 0) {
                items[index] = { ...items[index], ...data };
            } else {
                items.push(data);
            }

            await fs.ensureDir(path.dirname(filePath));
            await fs.writeJson(filePath, items, { spaces: 2 });
        }
    }

    async delete(table: string, uniqueKey: string, value: any): Promise<void> {
        assertAllowedTable(table);
        assertSafeIdentifier(uniqueKey, 'column');

        if (this.pool) {
            await this.pool.query(
                `DELETE FROM ${quoteIdent(table)} WHERE ${quoteIdent(uniqueKey)} = $1`,
                [value]
            );
        } else {
            const fs = await import('fs-extra');
            const path = await import('path');
            const filePath = path.join(process.cwd(), 'data', `${table}.json`);

            if (await fs.pathExists(filePath)) {
                let items = await fs.readJson(filePath);
                items = items.filter((item: any) => item[uniqueKey] !== value);
                await fs.writeJson(filePath, items, { spaces: 2 });
            }
        }
    }

    async countDailyMessages(memberId: string, sender: string): Promise<number> {
        if (this.pool) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const res = await this.pool.query(
                `SELECT COUNT(*) FROM "chat_history" WHERE "member_id" = $1 AND "sender" = $2 AND "created_at" >= $3`,
                [memberId, sender, today.toISOString()]
            );
            return parseInt(res.rows[0].count);
        }
        return 0;
    }

    // L-06: Database health check
    async healthCheck(): Promise<{ connected: boolean; latencyMs: number }> {
        if (!this.pool) {
            return { connected: false, latencyMs: -1 };
        }
        const start = Date.now();
        try {
            await this.pool.query('SELECT 1');
            return { connected: true, latencyMs: Date.now() - start };
        } catch {
            return { connected: false, latencyMs: Date.now() - start };
        }
    }

    // L-10: Graceful shutdown
    async close(): Promise<void> {
        if (sharedPool) {
            await sharedPool.end();
            sharedPool = null;
            console.log('📊 Database pool closed');
        }
    }
}
