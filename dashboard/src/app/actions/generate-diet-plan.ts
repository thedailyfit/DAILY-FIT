'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateDietPlan(params: {
    calories: number;
    cuisine: string;
    restrictions?: string;
    meals: number;
}) {
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

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json/g, "").replace(/```/g, "").trim();

        return JSON.parse(text);
    } catch (error) {
        console.error("Error generating diet plan:", error);
        throw new Error("Failed to generate diet plan");
    }
}
