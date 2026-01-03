export type ClientStatus = "Active" | "Paused" | "Trial" | "Inactive";

export type Client = {
    id: string;
    name: string;
    status: ClientStatus;
    phone: string;
    planName: string;
    nextPaymentDate: string | null; // ISO date or null
    lastActive: string | null; // ISO date or null
    email?: string;
    gender?: string;
    age?: number;
    height_cm?: number;
    weight_kg?: number;
    monthly_fee?: number;
    goal?: string;
};
