"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyBolwrKfEUsk-aEuQ-DMyHtEF-OtBLxe4Q"); // Fallback for dev

export async function generateAiMealPlan(profile: any) {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `
        You are an expert nutritionist. Create a daily meal plan for a client with the following profile:
        - Goal: ${profile.goal || 'General Health'}
        - Calories: ${profile.calories || '2000'} kcal target
        - Diet Preference: ${profile.diet || 'Balanced'}
        
        Output the plan strictly in this JSON format:
        {
            "meals": [
                {
                    "name": "Breakfast",
                    "time": "08:00",
                    "items": [
                        { "item": "Oats", "quantity": "50g", "macros": { "calories": 150, "protein": 5, "carbs": 27, "fats": 3 } }
                    ]
                }
            ]
        }
        
        Ensure broadly accurate macros. Include Breakfast, Lunch, Snack, Dinner.
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        if (!text) throw new Error("No response from AI");

        return JSON.parse(text);
    } catch (error) {
        console.error("AI Generation Error:", error);
        throw new Error("Failed to generate plan");
    }
}
