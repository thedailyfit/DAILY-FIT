export type PaymentStatus = 'paid' | 'due' | 'overdue' | 'refunded' | 'cancelled';
export type PaymentMethod = 'cash' | 'upi' | 'card' | 'online' | 'other';
export type BillingCycle = 'monthly' | 'package' | 'one_time' | 'trial';

export interface Payment {
    id: string;
    client_id: string;
    trainer_id?: string;
    client_name: string; // Joined from clients table
    amount: number;
    currency: string;
    status: PaymentStatus;
    billing_cycle: BillingCycle;
    due_date: string; // ISO date string
    paid_at?: string | null; // ISO date string
    method?: PaymentMethod;
    notes?: string | null;
    created_at: string;
}
