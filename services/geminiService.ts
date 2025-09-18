
import { GoogleGenAI, Chat } from '@google/genai';

// Assume process.env.API_KEY is configured in the environment.
if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const chat: Chat = ai.chats.create({
  model: 'gemini-2.5-flash',
  config: {
    systemInstruction: 'You are G-Assistant, a helpful AI integrated into Windows 6.1, a fictional operating system. Be helpful, concise, and slightly futuristic in your tone.',
  },
});

export async function* callGeminiStream(prompt: string): AsyncGenerator<string> {
    try {
        const stream = await chat.sendMessageStream({ message: prompt });
        for await (const chunk of stream) {
            yield chunk.text;
        }
    } catch (error) {
        console.error("Error in Gemini streaming call:", error);
        throw new Error("Failed to get response from Gemini API.");
    }
}
