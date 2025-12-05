import { Member, Trainer } from '../models/types';

export interface Agent {
    name: string;
    handleMessage(user: { type: 'member' | 'trainer' | 'unknown'; profile?: Member | Trainer }, message: string, context?: any): Promise<string | null>;
}
