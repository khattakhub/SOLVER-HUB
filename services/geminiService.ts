import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

// A singleton pattern for the AI instance to avoid re-initialization
let aiInstance: GoogleGenAI | null = null;

const getAi = (): GoogleGenAI => {
    if (aiInstance) {
        return aiInstance;
    }
    if (!process.env.API_KEY) {
        // This error will be thrown only when an AI function is called, not on module import.
        const helpfulError = `AI service is not configured. The application requires a Google Gemini API Key to function.

Please ensure the 'API_KEY' environment variable is set in your deployment environment.

For example, if deploying on Vercel:
1. Go to your Project Settings.
2. Navigate to 'Environment Variables'.
3. Add a variable named 'API_KEY' with your key as the value.
4. Redeploy your application.`;
        throw new Error(helpfulError);
    }
    aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return aiInstance;
};

const model = 'gemini-2.5-flash';

export const summarizeText = async (text: string): Promise<string> => {
    try {
        const ai = getAi();
        const prompt = `Summarize the following text into a few concise bullet points:\n\n${text}`;
        const response: GenerateContentResponse = await ai.models.generateContent({
            model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error summarizing text:", error);
        if (error instanceof Error && error.message.includes("API Key")) {
           throw error;
        }
        throw new Error("Failed to summarize text. Please try again.");
    }
};

export const checkGrammar = async (text: string): Promise<string> => {
    try {
        const ai = getAi();
        const prompt = `Correct any grammar and spelling mistakes in the following text. Return only the corrected text without any introductory phrases:\n\n"${text}"`;
        const response: GenerateContentResponse = await ai.models.generateContent({
            model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error checking grammar:", error);
        if (error instanceof Error && error.message.includes("API Key")) {
           throw error;
        }
        throw new Error("Failed to check grammar. Please try again.");
    }
};

export const getTextFromImage = async (base64Image: string, mimeType: string): Promise<string> => {
    try {
        const ai = getAi();
        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType,
            },
        };
        const textPart = { text: "Extract all text from this image. If there is no text, say so." };

        const response: GenerateContentResponse = await ai.models.generateContent({
            model,
            contents: { parts: [imagePart, textPart] },
        });
        return response.text;
    } catch (error) {
        console.error("Error extracting text from image:", error);
        if (error instanceof Error && error.message.includes("API Key")) {
           throw error;
        }
        throw new Error("Failed to extract text from image. Please try again.");
    }
};

export const getCurrencyConversion = async (amount: number, from: string, to: string): Promise<string> => {
    try {
        const ai = getAi();
        const prompt = `Convert ${amount} ${from} to ${to}. Provide only the final converted numeric value, without currency symbols or any extra text.`;
        const response: GenerateContentResponse = await ai.models.generateContent({
            model,
            contents: prompt,
        });
        const numericResult = parseFloat(response.text.replace(/,/g, ''));
        if (isNaN(numericResult)) {
            throw new Error("AI returned a non-numeric value.");
        }
        return numericResult.toFixed(2);
    } catch (error) {
        console.error("Error converting currency:", error);
        if (error instanceof Error && error.message.includes("API Key")) {
           throw error;
        }
        throw new Error("Failed to convert currency. Please try again.");
    }
};

export const generateImage = async (prompt: string): Promise<string> => {
    try {
        const ai = getAi();
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
            },
        });
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    } catch (error) {
        console.error("Error generating image:", error);
        if (error instanceof Error && error.message.includes("API Key")) {
           throw error;
        }
        throw new Error("Failed to generate image. Please try again.");
    }
};

export const createChat = (): Chat => {
    const ai = getAi(); // This check now happens when the component initializes the chat
    return ai.chats.create({
      model,
      config: {
        systemInstruction: 'You are a helpful AI assistant called Problem-Solver Bot. You provide clear, concise, and accurate answers to user questions.',
      },
    });
};