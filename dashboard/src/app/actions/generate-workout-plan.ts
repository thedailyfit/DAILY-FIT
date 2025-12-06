'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateWorkoutPlan(params: {
    goal: string;
    level: string;
    days: number;
    equipment: string;
    focus?: string;
}) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not set");
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        const prompt = `
      Generate a ${params.days}-day workout routine with the following requirements:
      - Goal: ${params.goal}
      - Experience Level: ${params.level}
      - Equipment Available: ${params.equipment}
      - Specific Focus: ${params.focus || "General"}

      Return ONLY a valid JSON object with this structure:
      {
        "days": [
          {
            "day_name": "Day 1",
            "focus": "Upper Body Push",
            "exercises": [
              { "name": "Push Ups", "sets": "3", "reps": "10-12", "notes": "Keep core tight" }
            ]
          },
          ...
        ]
      }
      Do not include markdown formatting like \`\`\`json. Just the raw JSON string.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json/g, "").replace(/```/g, "").trim();

        return JSON.parse(text);
    } catch (error) {
        console.error("Error generating workout plan:", error);
        throw new Error("Failed to generate workout plan");
    }
}
