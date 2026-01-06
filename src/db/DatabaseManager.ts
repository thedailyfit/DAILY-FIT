import { Pool } from 'pg';

export class DatabaseManager {
    private pool?: Pool;

    constructor() {
        // Use PostgreSQL if DATABASE_URL is set, otherwise fallback to JSON files
        if (process.env.DATABASE_URL) {
            this.pool = new Pool({
                connectionString: process.env.DATABASE_URL,
                ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
            });
            console.log('📊 Using PostgreSQL database');
        } else {
            console.log('📁 DATABASE_URL not set, using JSON files');
        }
    }

    async read<T>(table: string, query?: { [key: string]: any }): Promise<T[]> {
        if (this.pool) {
            if (query && Object.keys(query).length > 0) {
                const keys = Object.keys(query);
                const values = Object.values(query);
                const whereClause = keys.map((k, i) => `${k} = $${i + 1}`).join(' AND ');
                const result = await this.pool.query(`SELECT * FROM ${table} WHERE ${whereClause}`, values);
                return result.rows;
            } else {
                const result = await this.pool.query(`SELECT * FROM ${table}`);
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

    async findOne<T>(table: string, query: { [key: string]: any }): Promise<T | undefined> {
        const items = await this.read<T>(table, query);
        return items[0];
    }

    async upsert<T extends { [key: string]: any }>(
        table: string,
        data: T,
        uniqueKey: string
    ): Promise<void> {
        if (this.pool) {
            // PostgreSQL upsert
            const keys = Object.keys(data).filter(k => data[k] !== undefined);
            const values = keys.map(k => {
                const value = data[k];
                // Convert arrays and objects to JSON
                if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
                    return JSON.stringify(value);
                }
                return value;
            });

            const placeholders = keys.map((_, i) => `$${i + 1}`);
            const updateSet = keys.map((k) => `${k} = EXCLUDED.${k}`).join(', ');

            const query = `
                INSERT INTO ${table} (${keys.join(', ')})
                VALUES (${placeholders.join(', ')})
                ON CONFLICT (${uniqueKey})
                DO UPDATE SET ${updateSet}
            `;

            await this.pool.query(query, values);
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
        if (this.pool) {
            await this.pool.query(`DELETE FROM ${table} WHERE ${uniqueKey} = $1`, [value]);
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
                `SELECT COUNT(*) FROM chat_history WHERE member_id = $1 AND sender = $2 AND created_at >= $3`,
                [memberId, sender, today.toISOString()]
            );
            return parseInt(res.rows[0].count);
        }
        return 0;
    }
}
