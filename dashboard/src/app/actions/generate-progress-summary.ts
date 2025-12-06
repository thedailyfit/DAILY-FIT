'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateProgressSummary(clientName: string, progressEntries: any[]) {
    if (!process.env.GEMINI_API_KEY) {
        return "Error: GEMINI_API_KEY is not set in the environment.";
    }

    if (!progressEntries || progressEntries.length === 0) {
        return "No progress data available to analyze.";
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        // Format data for the prompt
        const dataString = progressEntries.map(e =>
            `- Date: ${e.date}, Weight: ${e.weight_kg}kg, Body Fat: ${e.body_fat_percentage || 'N/A'}%, Notes: ${e.notes || 'None'}`
        ).join("\n");

        const prompt = `
      You are an expert fitness coach analyzing a client's progress.
      Client Name: ${clientName}
      
      Here is their progress log (ordered by date):
      ${dataString}

      Please provide a concise, encouraging, and analytical summary of their progress.
      1. Highlight the total weight change and trend.
      2. Mention any significant changes in body composition if available.
      3. Comment on their consistency based on the log dates.
      4. Provide 1-2 specific recommendations or words of encouragement based on the data.
      
      Keep the tone professional yet motivating. Keep it under 150 words.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error generating summary:", error);
        return "Failed to generate summary. Please try again later.";
    }
}
