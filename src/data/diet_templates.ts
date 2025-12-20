export const DIET_TEMPLATES = [
    {
        "template_id": "sys_diet_001",
        "name": "North Indian Vegetarian (1500 kcal)",
        "type": "veg",
        "region": "North Indian",
        "calories": 1500,
        "macros": { "protein": 60, "carbs": 200, "fats": 50 },
        "meals": [
            { "time": "08:00", "name": "Breakfast", "calories": 300, "protein": 10, "items": ["2 Roti", "1/2 cup Curd"] },
            { "time": "13:00", "name": "Lunch", "calories": 500, "protein": 15, "items": ["1 cup Dal Tadka", "1 cup Rice", "Salad"] },
            { "time": "20:00", "name": "Dinner", "calories": 400, "protein": 15, "items": ["2 Roti", "1 cup Paneer Bhurji"] }
        ]
    },
    {
        "template_id": "sys_diet_002",
        "name": "Punjabi Power - Non Veg (2000 kcal)",
        "type": "non-veg",
        "region": "North Indian",
        "calories": 2000,
        "macros": { "protein": 140, "carbs": 180, "fats": 70 },
        "meals": [
            { "time": "08:00", "name": "Breakfast", "calories": 400, "protein": 25, "items": ["3 Egg Omelette", "2 Toast"] },
            { "time": "13:00", "name": "Lunch", "calories": 700, "protein": 40, "items": ["Butter Chicken (Low Oil)", "2 Naan", "Salad"] },
            { "time": "20:00", "name": "Dinner", "calories": 600, "protein": 35, "items": ["Chicken Tikka", "Green Chutney", "1 Roti"] }
        ]
    },
    {
        "template_id": "sys_diet_003",
        "name": "South Indian Traditional Veg (1600 kcal)",
        "type": "veg",
        "region": "South Indian",
        "calories": 1600,
        "macros": { "protein": 50, "carbs": 250, "fats": 40 },
        "meals": [
            { "time": "08:00", "name": "Breakfast", "calories": 350, "protein": 8, "items": ["3 Idli", "Sambar", "Coconut Chutney"] },
            { "time": "13:00", "name": "Lunch", "calories": 600, "protein": 15, "items": ["1 cup Rice", "Sambar", "Rasam", "Cabbage Poriyal"] },
            { "time": "20:00", "name": "Dinner", "calories": 300, "protein": 10, "items": ["2 Dosa", "Tomato Chutney"] }
        ]
    },
    {
        "template_id": "sys_diet_004",
        "name": "Kerala Fish Diet (1800 kcal)",
        "type": "non-veg",
        "region": "South Indian",
        "calories": 1800,
        "macros": { "protein": 100, "carbs": 200, "fats": 60 },
        "meals": [
            { "time": "08:00", "name": "Breakfast", "calories": 400, "protein": 10, "items": ["Puttu", "Kadala Curry"] },
            { "time": "13:00", "name": "Lunch", "calories": 700, "protein": 40, "items": ["Kerala Fish Curry", "Red Rice", "Avial"] },
            { "time": "20:00", "name": "Dinner", "calories": 400, "protein": 30, "items": ["Grilled Fish", "Salad"] }
        ]
    },
    {
        "template_id": "sys_diet_005",
        "name": "Maharashtrian Home Veg (1400 kcal)",
        "type": "veg",
        "region": "Maharashtrian",
        "calories": 1400,
        "macros": { "protein": 45, "carbs": 200, "fats": 45 },
        "meals": [
            { "time": "08:00", "name": "Breakfast", "calories": 300, "protein": 8, "items": ["Poha", "Peanuts"] },
            { "time": "13:00", "name": "Lunch", "calories": 500, "protein": 15, "items": ["2 Bhakri", "Pitla", "Thecha"] },
            { "time": "20:00", "name": "Dinner", "calories": 350, "protein": 12, "items": ["Masala Khichdi", "Kadhi"] }
        ]
    },
    {
        "template_id": "sys_diet_006",
        "name": "Bengali Fish Lover (1700 kcal)",
        "type": "non-veg",
        "region": "Bengali",
        "calories": 1700,
        "macros": { "protein": 90, "carbs": 220, "fats": 50 },
        "meals": [
            { "time": "08:00", "name": "Breakfast", "calories": 350, "protein": 10, "items": ["Luchi", "Alur Dom (Less Oil)"] },
            { "time": "13:00", "name": "Lunch", "calories": 700, "protein": 35, "items": ["Maacher Jhol (Fish Curry)", "Rice", "Shukto"] },
            { "time": "20:00", "name": "Dinner", "calories": 400, "protein": 25, "items": ["Chicken Curry", "1 Roti"] }
        ]
    },
    {
        "template_id": "sys_diet_007",
        "name": "Gujarati Jain Veg (1300 kcal)",
        "type": "veg",
        "region": "Gujarati",
        "calories": 1300,
        "macros": { "protein": 40, "carbs": 200, "fats": 40 },
        "meals": [
            { "time": "08:00", "name": "Breakfast", "calories": 300, "protein": 8, "items": ["Thepla", "Chunda"] },
            { "time": "13:00", "name": "Lunch", "calories": 500, "protein": 15, "items": ["Gujarati Dal", "Rice", "Rotli", "Shaak"] },
            { "time": "20:00", "name": "Dinner", "calories": 300, "protein": 8, "items": ["Dhokla", "Green Chutney"] }
        ]
    },
    {
        "template_id": "sys_diet_008",
        "name": "High Protein Vegetarian - Gym Special (2000 kcal)",
        "type": "veg",
        "region": "General",
        "calories": 2000,
        "macros": { "protein": 120, "carbs": 200, "fats": 60 },
        "meals": [
            { "time": "08:00", "name": "Breakfast", "calories": 500, "protein": 30, "items": ["Paneer Bhurji", "2 Multigrain Toast"] },
            { "time": "13:00", "name": "Lunch", "calories": 600, "protein": 30, "items": ["Soya Chunk Curry", "Quinoa/Rice", "Curd"] },
            { "time": "17:00", "name": "Snack", "calories": 200, "protein": 20, "items": ["Whey Protein Shake"] },
            { "time": "20:00", "name": "Dinner", "calories": 500, "protein": 25, "items": ["Tofu Stir Fry", "Salad"] }
        ]
    },
    {
        "template_id": "sys_diet_009",
        "name": "Vegetarian Keto - Indian Style (1400 kcal)",
        "type": "keto",
        "region": "General",
        "calories": 1400,
        "macros": { "protein": 80, "carbs": 30, "fats": 100 },
        "meals": [
            { "time": "08:00", "name": "Breakfast", "calories": 400, "protein": 20, "items": ["Paneer Omelette (Besan chilla with Paneer)", "Almonds"] },
            { "time": "13:00", "name": "Lunch", "calories": 500, "protein": 25, "items": ["Palak Paneer", "Cauliflower Rice"] },
            { "time": "20:00", "name": "Dinner", "calories": 400, "protein": 25, "items": ["Grilled Cheese & Veggies", "Mushroom Soup"] }
        ]
    },
    {
        "template_id": "sys_diet_010",
        "name": "Andhra Spicy Non-Veg (1900 kcal)",
        "type": "non-veg",
        "region": "South Indian",
        "calories": 1900,
        "macros": { "protein": 110, "carbs": 200, "fats": 65 },
        "meals": [
            { "time": "08:00", "name": "Breakfast", "calories": 400, "protein": 20, "items": ["Pesarattu Upma", "Ginger Chutney"] },
            { "time": "13:00", "name": "Lunch", "calories": 800, "protein": 45, "items": ["Andhra Chicken Curry", "Rice", "Rasam"] },
            { "time": "20:00", "name": "Dinner", "calories": 500, "protein": 25, "items": ["Egg Curry", "2 Chapati"] }
        ]
    },
    {
        "template_id": "sys_diet_011",
        "name": "Intermittent Fasting - 16:8 (1500 kcal)",
        "type": "veg",
        "region": "General",
        "calories": 1500,
        "macros": { "protein": 80, "carbs": 150, "fats": 60 },
        "meals": [
            { "time": "12:00", "name": "Meal 1", "calories": 700, "protein": 35, "items": ["Chana Masala", "Rice", "Salad", "Curd"] },
            { "time": "16:00", "name": "Snack", "calories": 200, "protein": 10, "items": ["Fruits", "Walnuts"] },
            { "time": "20:00", "name": "Meal 2", "calories": 600, "protein": 35, "items": ["Paneer Tikka", "Green Salad"] }
        ]
    },
    {
        "template_id": "sys_diet_012",
        "name": "Budget Student Diet (1800 kcal)",
        "type": "non-veg",
        "region": "General",
        "calories": 1800,
        "macros": { "protein": 100, "carbs": 220, "fats": 60 },
        "meals": [
            { "time": "08:00", "name": "Breakfast", "calories": 400, "protein": 20, "items": ["4 Boiled Eggs", "Bread"] },
            { "time": "13:00", "name": "Lunch", "calories": 600, "protein": 30, "items": ["Chicken Breast", "Rice", "Banana"] },
            { "time": "20:00", "name": "Dinner", "calories": 600, "protein": 30, "items": ["Soy Chunk Curry", "Rice"] }
        ]
    },
    {
        "template_id": "sys_diet_013",
        "name": "Hyderabadi Biryani Lover (2200 kcal - Bulk)",
        "type": "non-veg",
        "region": "South Indian",
        "calories": 2200,
        "macros": { "protein": 130, "carbs": 250, "fats": 80 },
        "meals": [
            { "time": "08:00", "name": "Breakfast", "calories": 500, "protein": 30, "items": ["Kheema Roti"] },
            { "time": "13:00", "name": "Lunch", "calories": 900, "protein": 50, "items": ["Chicken Biryani (Limit Portion)", "Mirchi Ka Salan", "Raita"] },
            { "time": "20:00", "name": "Dinner", "calories": 600, "protein": 40, "items": ["Mutton Curry", "2 Roti"] }
        ]
    },
    {
        "template_id": "sys_diet_014",
        "name": "Sattvic Yoga Diet (1200 kcal)",
        "type": "veg",
        "region": "General",
        "calories": 1200,
        "macros": { "protein": 40, "carbs": 180, "fats": 30 },
        "meals": [
            { "time": "08:00", "name": "Breakfast", "calories": 300, "protein": 5, "items": ["Fruit Salad", "Honey"] },
            { "time": "13:00", "name": "Lunch", "calories": 500, "protein": 15, "items": ["Khichdi", "Ghee", "Vegetables"] },
            { "time": "19:00", "name": "Dinner", "calories": 300, "protein": 10, "items": ["Warm Milk", "Dates", "Nuts"] }
        ]
    },
    {
        "template_id": "sys_diet_015",
        "name": "Detox Green Diet (1000 kcal)",
        "type": "vegan",
        "region": "General",
        "calories": 1000,
        "macros": { "protein": 30, "carbs": 150, "fats": 20 },
        "meals": [
            { "time": "08:00", "name": "Breakfast", "calories": 200, "protein": 2, "items": ["Green Smoothie (Spinach, Apple, Cucumber)"] },
            { "time": "13:00", "name": "Lunch", "calories": 400, "protein": 15, "items": ["Quinoa Salad", "Chickpeas"] },
            { "time": "19:00", "name": "Dinner", "calories": 300, "protein": 10, "items": ["Soup", "Steamed Broccoli"] }
        ]
    }
];
