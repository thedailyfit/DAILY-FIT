export type ClientStatus = "Active" | "Paused" | "Trial" | "Inactive";

export type Client = {
    id: string;
    name: string;
    status: ClientStatus;
    phone: string;
    planName: string;
    nextPaymentDate: string | null; // ISO date or null
    lastActive: string | null; // ISO date or null
};
