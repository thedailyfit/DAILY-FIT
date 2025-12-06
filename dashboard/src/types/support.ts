export type SupportTicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type SupportTicketPriority = 'low' | 'normal' | 'high' | 'urgent';
export type SupportTicketCategory = 'technical' | 'billing' | 'plan_help' | 'feature_request' | 'other';

export interface SupportTicket {
    id: string; // This maps to ticket_id from the view usually, or just id
    ticket_id?: string; // From view
    trainer_id: string;
    trainer_email?: string;
    client_id?: string | null;
    client_name?: string | null;
    subject: string;
    category: SupportTicketCategory;
    status: SupportTicketStatus;
    priority: SupportTicketPriority;
    created_at: string;
    updated_at: string;
    resolved_at?: string | null;
}
