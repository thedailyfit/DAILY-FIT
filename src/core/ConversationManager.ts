import { DatabaseManager } from '../db/DatabaseManager';

export interface ConversationState {
    whatsapp_id: string;
    step: string;
    data: any;
}

export class ConversationManager {
    private db: DatabaseManager;

    constructor(db: DatabaseManager) {
        this.db = db;
    }

    async getState(whatsappId: string): Promise<ConversationState | undefined> {
        return this.db.findOne<ConversationState>('conversations', (c) => c.whatsapp_id === whatsappId);
    }

    async setState(whatsappId: string, step: string, data: any = {}): Promise<void> {
        const state: ConversationState = { whatsapp_id: whatsappId, step, data };
        await this.db.upsert('conversations', state, 'whatsapp_id');
    }

    async clearState(whatsappId: string): Promise<void> {
        // In a real DB we would delete. For JSON, we can set step to 'idle' or filter out.
        // For now, let's set to idle.
        await this.setState(whatsappId, 'idle', {});
    }

    async updateData(whatsappId: string, newData: any): Promise<void> {
        const state = await this.getState(whatsappId);
        if (state) {
            await this.setState(whatsappId, state.step, { ...state.data, ...newData });
        }
    }
}
