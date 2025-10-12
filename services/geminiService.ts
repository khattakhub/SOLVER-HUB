
import { GoogleGenAI, GenerateContentResponse, Chat, StartChatParams, GenerateContentRequest } from "@google/genai";

let ai: GoogleGenAI | null = null;

/**
 * Initializes the GoogleGenAI service with the API key from site settings.
 */
export const initializeGeminiService = (apiKey: string): void => {
    if (apiKey && apiKey.trim().length > 0) {
        try {
            ai = new GoogleGenAI({ apiKey });
        } catch (error) {
            console.error("Failed to initialize Gemini AI Service:", error);
            ai = null;
        }
    } else {
        ai = null;
    }
};

/**
 * Safely gets the initialized AI instance.
 */
const getAi = (): GoogleGenAI => {
    if (!ai) {
        throw new Error("Gemini API Key not found. Please set it in the admin settings page.");
    }
    return ai;
};

/**
 * A consistent error handler for all API calls.
 */
const handleApiError = (error: unknown, defaultMessage: string): never => {
    console.error(defaultMessage, error);
    if (error instanceof Error && error.message.includes("API Key")) {
        throw new Error("The provided Gemini API Key is invalid or has exceeded its quota. Please check the key in the admin settings.");
    }
    throw new Error(`${defaultMessage}. Please try again.`);
};


export const summarizeText = async (text: string): Promise<string> => {
    try {
        const prompt = `Summarize the following text into a few concise bullet points:\n\n${text}`;
        const response: GenerateContentResponse = await getAi().models.generateContent({
            model: 'gemini-1.0-pro',
            contents: [{ parts: [{ text: prompt }] }],
        });
        return response.text;
    } catch (error) {
        handleApiError(error, "Failed to summarize text");
    }
};

export const checkGrammar = async (text: string): Promise<string> => {
    try {
        const prompt = `Correct any grammar and spelling mistakes in the following text. Return only the corrected text without any introductory phrases:\n\n\"${text}\"`;
        const response: GenerateContentResponse = await getAi().models.generateContent({
            model: 'gemini-1.0-pro',
            contents: [{ parts: [{ text: prompt }] }],
        });
        return response.text;
    } catch (error) {
        handleApiError(error, "Failed to check grammar");
    }
};

export const getTextFromImage = async (base64Image: string, mimeType: string): Promise<string> => {
    try {
        const imagePart = { inlineData: { data: base64Image, mimeType } };
        const textPart = { text: "Extract all text from this image. If there is no text, say so." };
        
        const response: GenerateContentResponse = await getAi().models.generateContent({
            model: 'gemini-pro-vision',
            contents: { parts: [imagePart, textPart] },
        });
        return response.text;
    } catch (error) {
        handleApiError(error, "Failed to extract text from image");
    }
};

export const getCurrencyConversion = async (amount: number, from: string, to: string): Promise<string> => {
    try {
        const prompt = `Convert ${amount} ${from} to ${to}. Provide only the final converted numeric value, without currency symbols or any extra text.`;
        const response: GenerateContentResponse = await getAi().models.generateContent({
            model: 'gemini-1.0-pro',
            contents: [{ parts: [{ text: prompt }] }],
        });
        const numericResult = parseFloat(response.text.replace(/,/g, ''));
        if (isNaN(numericResult)) {
            throw new Error("AI returned a non-numeric value.");
        }
        return numericResult.toFixed(2);
    } catch (error) {
        handleApiError(error, "Failed to convert currency");
    }
};

export const createChat = (): Chat => {
    try {
        const chat: Chat = getAi().chats.create({
            model: 'gemini-1.0-pro',
        });
        return chat;
    } catch (error) {
        handleApiError(error, "Failed to create chat session");
    }
};

export const generateImage = async (prompt: string): Promise<string> => {
    try {
        console.warn("Image generation is not yet supported by this version of the Gemini API.");
        return new Promise(resolve => setTimeout(() => resolve("/placeholder.jpg"), 1000));
    } catch (error) {
        handleApiError(error, "Failed to generate image");
    }
};
