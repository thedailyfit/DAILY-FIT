"use strict";
'use server';
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
exports.generateDietPlan = generateDietPlan;
const generative_ai_1 = require("@google/generative-ai");
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
function generateDietPlan(params) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is not set");
        }
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
            const prompt = `
      Generate a 1-day diet plan with the following requirements:
      - Target Calories: ${params.calories} kcal
      - Cuisine Preference: ${params.cuisine}
      - Dietary Restrictions: ${params.restrictions || "None"}
      - Number of Meals: ${params.meals} (e.g., 3 main meals + snacks)

      Return ONLY a valid JSON object with this structure:
      {
        "meals": [
          {
            "name": "Breakfast",
            "items": [
              { "name": "Food Item Name", "portion": "1 cup", "calories": 300, "protein": 10, "carbs": 40, "fats": 10 }
            ],
            "total_calories": 300
          },
          ...
        ],
        "total_calories": 0,
        "macros": { "protein": 0, "carbs": 0, "fats": 0 }
      }
      Do not include markdown formatting like \`\`\`json. Just the raw JSON string.
    `;
            const result = yield model.generateContent(prompt);
            const response = yield result.response;
            const text = response.text().replace(/```json/g, "").replace(/```/g, "").trim();
            return JSON.parse(text);
        }
        catch (error) {
            console.error("Error generating diet plan:", error);
            throw new Error("Failed to generate diet plan");
        }
    });
}
