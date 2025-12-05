export interface Macros {
    calories: number
    protein: number
    carbs: number
    fats: number
}

export interface FoodItem {
    item: string
    quantity: string
    macros: Macros
}

export interface Meal {
    name: string // e.g., "Breakfast"
    items: FoodItem[]
}

export interface MealPlanData {
    daily_calories: number
    macros_target: {
        protein: string
        carbs: string
        fats: string
    }
    meals: Meal[]
}

export interface MealPlan {
    id: string
    member_id: string
    plan_data: MealPlanData
    created_at: string
    status: 'active' | 'archived'
}
