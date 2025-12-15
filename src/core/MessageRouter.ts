import { DatabaseManager } from '../db/DatabaseManager';
import { Member, Trainer } from '../models/types';

export class MessageRouter {
    private db: DatabaseManager;

    constructor(db: DatabaseManager) {
        this.db = db;
    }

    async identifyUser(whatsappId: string): Promise<{ type: 'member' | 'trainer' | 'unknown'; profile?: Member | Trainer }> {
        const trainer = await this.db.findOne<Trainer>('trainers', { whatsapp_id: whatsappId });
        if (trainer) {
            return { type: 'trainer', profile: trainer };
        }

        const member = await this.db.findOne<Member>('members', { whatsapp_id: whatsappId });
        if (member) {
            return { type: 'member', profile: member };
        }

        return { type: 'unknown' };
    }
}
