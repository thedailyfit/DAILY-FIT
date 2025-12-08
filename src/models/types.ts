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
