
import { Client } from "./client";

export type GymMember = Client & {
    cardio_fee?: number;
    area?: string;
    bmi?: number; // Calculated field
    whatsapp?: string; // Alias for phone/whatsapp_id
    assigned_trainer_id?: string;
    trainer_name?: string;
};
