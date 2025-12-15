"use strict";
"use server";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAiMealPlan = generateAiMealPlan;
const generative_ai_1 = require("@google/generative-ai");
// Initialize Gemini
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyBolwrKfEUsk-aEuQ-DMyHtEF-OtBLxe4Q"); // Fallback for dev
function generateAiMealPlan(profile) {
    return __awaiter(this, void 0, void 0, function* () {
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
            const result = yield model.generateContent(prompt);
            const text = result.response.text();
            if (!text)
                throw new Error("No response from AI");
            return JSON.parse(text);
        }
        catch (error) {
            console.error("AI Generation Error:", error);
            throw new Error("Failed to generate plan");
        }
    });
}
