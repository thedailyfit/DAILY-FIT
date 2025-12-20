export interface Member {
    member_id: string;
    whatsapp_id: string;
    name: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    height_cm: number;
    weight_kg: number;
    goal: 'fat_loss' | 'muscle_gain' | 'maintenance';
    diet_preference: 'veg' | 'non-veg' | 'vegan';
    allergies: string[];
    trainer_id?: string;
    adherence_score: number;
    weight_history: { date: string; weight: number }[];
    sleep_history: { date: string; hours: number }[];
    check_in_history: { date: string; mood: string }[];
    meal_logs: { date: string; meal_name: string; calories: number; photo_url?: string }[];
    plan_id_active?: string;
    consent_flags: {
        terms_accepted: boolean;
        data_processing: boolean;
    };
}

export interface Trainer {
    trainer_id: string;
    whatsapp_id: string;
    name: string;
    age?: number;
    phone_number?: string;
    city?: string;
    profile_picture_url?: string;
    specialization: string;
    assigned_member_ids: string[];
    edit_history: string[]; // IDs of change logs
    daily_digest_preferences: {
        time: string; // HH:MM
        include_low_adherence: boolean;
    };
}

export interface Meal {
    time: string; // HH:MM
    name: string;
    calories: number;
    protein: number;
    carbs?: number;
    fat?: number;
}

export interface MealPlan {
    plan_id: string;
    member_id: string;
    version_number: number;
    daily_calories: number;
    macros: {
        protein_g: number;
        carbs_g: number;
        fat_g: number;
    };
    meals: Meal[];
    created_by: 'AI' | 'Trainer';
    approved_by?: string; // Trainer ID
    status: 'draft' | 'active' | 'scheduled' | 'archived';
    notes?: string;
    created_timestamp: string;
}

export interface Exercise {
    name: string;
    sets: number;
    reps: string; // string to allow "10-12" or "failure"
    rest: string; // e.g., "60s"
    notes?: string;
}

export interface WorkoutPlan {
    plan_id: string;
    member_id: string;
    version: number;
    exercises: Exercise[];
    created_by: 'AI' | 'Trainer';
    approved_by?: string;
    status: 'draft' | 'active' | 'scheduled' | 'archived';
}

export interface ChangeLog {
    change_id: string;
    plan_id: string;
    member_id: string;
    trainer_id: string;
    before_json: string; // stringified JSON
    after_json: string; // stringified JSON
    reason: string;
    timestamp: string;
}

export interface PersonalizationVector {
    member_id: string;
    activity_factor: number;
    carb_tolerance_score: number;
    protein_requirement_adjustment: number;
    satiety_score: number;
    sleep_adjustment_factor: number;
    last_updated: string;
}

export interface Gym {
    gym_id: string;
    owner_name: string;
    gym_name: string;
    whatsapp_business_id?: string;
    subscription_status: 'active' | 'inactive' | 'trial';
    subscription_plan: 'basic' | 'pro' | 'enterprise';
    trainers_allowed: number;
    members_limit: number;
    created_at: string;
}

export interface GymLead {
    lead_id: string;
    gym_id: string; // The gym they enquired about
    whatsapp_id: string;
    name: string;
    status: 'new' | 'contacted' | 'converted' | 'lost';
    notes: string;
    created_at: string;
    follow_up_date?: string;
}

export interface DietTemplate {
    template_id: string;
    gym_id?: string; // If null, it's a "System Standard" template
    name: string; // e.g., "North Indian Vegetarian - 1800kcal"
    type: 'veg' | 'non-veg' | 'vegan' | 'keto' | 'other';
    region?: 'North Indian' | 'South Indian' | 'Maharashtrian' | 'Bengali' | 'General';
    calories: number;
    macros: { protein: number; carbs: number; fats: number };
    meals: Meal[];
    is_public: boolean;
}

export interface WorkoutTemplate {
    template_id: string;
    gym_id?: string;
    name: string; // e.g., "5 Day Split - Hypertrophy"
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    exercises: Exercise[];
}

export interface Subscription {
    sub_id: string;
    gym_id: string;
    plan_name: string;
    amount: number;
    currency: string;
    billing_cycle: 'monthly' | 'yearly';
    start_date: string;
    next_billing_date: string;
    status: 'active' | 'past_due' | 'canceled';
}

export interface WeightCheckin {
    checkin_id: string;
    member_id: string;
    date: string;
    photo_url: string;
    weight_extracted: number;
    verified: boolean; // if trainer confirmed it
}
