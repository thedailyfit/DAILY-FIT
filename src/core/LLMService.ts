import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export class LLMService {
    private apiKey: string;
    private baseUrl: string = 'https://generativelanguage.googleapis.com/v1/models';
    private model: string = 'gemini-2.0-flash';

    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY || "AIzaSyBolwrKfEUsk-aEuQ-DMyHtEF-OtBLxe4Q";
    }

    async generateResponse(
        userMessage: string,
        context: any,
        history: { role: string, parts: string }[] = []
    ): Promise<string> {
        try {
            const systemPrompt = `
You are 'FitBot', an enthusiastic, empathetic, and knowledgeable personal fitness trainer.
Your goal is to help members achieve their fitness goals (fat loss, muscle gain, maintenance).

CONTEXT ABOUT THE USER:
Name: ${context.name || 'Friend'}
Goal: ${context.goal || 'Not set'}
Diet: ${context.diet_preference || 'Not set'}
Stats: ${context.age ? `${context.age}y, ${context.weight_kg}kg, ${context.height_cm}cm` : 'Not fully set'}

RULES:
1. Be friendly, motivating, and use emojis 🏋️‍♂️🥗.
2. Keep responses concise (WhatsApp style).
3. If they ask about workouts or meals, give specific advice based on their goal/diet.
4. If they are onboarding, guide them gently.
5. NEVER mention you are an AI model. You are a coach.
6. If they ask "who are you", say you are their personal AI coach from DailyFit.

USER MESSAGE: "${userMessage}"

Generate a helpful, trainer-like response.
`;

            const response = await axios.post(
                `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`,
                {
                    contents: [{
                        parts: [{
                            text: systemPrompt
                        }]
                    }]
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            const generatedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!generatedText) {
                throw new Error('No text generated from API');
            }

            return generatedText.trim();
        } catch (error: any) {
            console.error("LLM Error:", error.response?.data || error.message);
            return "I'm having a little trouble thinking right now! 🧠💥 Let's try that again in a moment.";
        }
    }

    async extractName(input: string): Promise<string> {
        try {
            const prompt = `
Extract ONLY the first name from this text. If no name is found, return "UNKNOWN".
Text: "${input}"
Name:`;

            const response = await axios.post(
                `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`,
                {
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            const name = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
            return name === "UNKNOWN" ? "" : name || "";
        } catch (error) {
            console.error("Name extraction error:", error);
            return "";
        }
    }

    async generateOnboardingResponse(step: string, userInput: string, context: any = {}): Promise<string> {
        try {
            const prompt = `
You are 'FitBot', a friendly AI fitness coach.
You are currently onboarding a new member.

Current Step: Asking for ${step.toUpperCase()}
User's Name: ${context.name || 'Not set yet'}
User Input: "${userInput}"

The user's input is NOT a valid answer to your question about ${step}.

Your task:
1. Acknowledge their question or comment politely.
2. Explain WHY you need this specific information:
   - Age: To calculate BMR (Basal Metabolic Rate) and personalized calorie needs
   - Weight: To determine accurate macros and track progress
   - Height: To calculate BMI and daily calorie requirements
3. Gently ask the question again.

Keep it short, friendly, and use emojis. Maximum 2-3 sentences.
`;

            const response = await axios.post(
                `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`,
                {
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            const generatedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!generatedText) {
                throw new Error('No text generated from API');
            }

            return generatedText.trim();
        } catch (error: any) {
            console.error("LLM Error:", error.response?.data || error.message);
            return "I didn't quite catch that! Could you please answer the question? 😊";
        }
    }
    async getAgentResponse<T>(systemPrompt: string, input: any): Promise<T> {
        try {
            const fullPrompt = `
${systemPrompt}

INPUT JSON:
${JSON.stringify(input, null, 2)}

OUTPUT JSON:
`;

            const response = await axios.post(
                `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`,
                {
                    contents: [{
                        parts: [{
                            text: fullPrompt
                        }]
                    }],
                    generationConfig: {
                        response_mime_type: "application/json"
                    }
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            const generatedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!generatedText) {
                throw new Error('No text generated from API');
            }

            return JSON.parse(generatedText) as T;
        } catch (error: any) {
            console.error("LLM Agent Error:", error.response?.data || error.message);
            throw error;
        }
    }

    async getVisionAgentResponse<T>(systemPrompt: string, input: any, imageUrl: string): Promise<T> {
        try {
            // Download image
            const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const base64Image = Buffer.from(imageResponse.data).toString('base64');
            const mimeType = imageResponse.headers['content-type'];

            const fullPrompt = `
${systemPrompt}

INPUT JSON:
${JSON.stringify(input, null, 2)}

OUTPUT JSON:
`;

            const response = await axios.post(
                `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`,
                {
                    contents: [{
                        parts: [
                            { text: fullPrompt },
                            {
                                inline_data: {
                                    mime_type: mimeType,
                                    data: base64Image
                                }
                            }
                        ]
                    }],
                    generationConfig: {
                        response_mime_type: "application/json"
                    }
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            const generatedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!generatedText) {
                throw new Error('No text generated from API');
            }

            return JSON.parse(generatedText) as T;
        } catch (error: any) {
            console.error("LLM Vision Error:", error.response?.data || error.message);
            throw error;
        }
    }

    async transcribeAudio(audioUrl: string): Promise<string> {
        try {
            console.log(`🎤 Transcribing audio from: ${audioUrl}`);

            // Download audio
            const audioResponse = await axios.get(audioUrl, { responseType: 'arraybuffer' });
            const base64Audio = Buffer.from(audioResponse.data).toString('base64');
            const mimeType = audioResponse.headers['content-type'] || 'audio/ogg'; // Default for WhatsApp

            const prompt = `
            Please transcribe this audio file accurately. 
            Return ONLY the transcription text. Do not add any intro or outro.
            If the audio is silent or unintelligible, return "[Unintelligible Audio]".
            `;

            const response = await axios.post(
                `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`,
                {
                    contents: [{
                        parts: [
                            { text: prompt },
                            {
                                inline_data: {
                                    mime_type: mimeType,
                                    data: base64Audio
                                }
                            }
                        ]
                    }]
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            const transcription = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!transcription) {
                throw new Error('No transcription generated');
            }

            console.log(`✅ Transcription: "${transcription.trim()}"`);
            return transcription.trim();

        } catch (error: any) {
            console.error("LLM Transcription Error:", error.response?.data || error.message);
            return "[Error transcribing audio]";
        }
    }
}
