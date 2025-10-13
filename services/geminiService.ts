
import type { GoogleGenAI, GenerateContentResponse, Chat, Content } from "@google/genai";

// Store the dynamically imported module in a variable
let genAiModule: typeof import('@google/genai') | null = null;
let ai: GoogleGenAI | null = null;

/**
 * Dynamically loads the GoogleGenAI module and initializes the service.
 */
const loadAndInitialize = async (apiKey: string) => {
    try {
        if (!genAiModule) {
            genAiModule = await import('@google/genai');
        }
        ai = new genAiModule.GoogleGenAI({ apiKey });
    } catch (error) {
        console.error("Failed to load or initialize Gemini AI Service:", error);
        ai = null;
        genAiModule = null; // Reset on failure
    }
};

/**
 * Initializes the GoogleGenAI service with the API key from site settings.
 */
export const initializeGeminiService = async (apiKey: string): Promise<void> => {
    if (apiKey && apiKey.trim().length > 0) {
        await loadAndInitialize(apiKey);
    } else {
        ai = null;
    }
};

/**
 * Safely gets the initialized AI instance.
 */
const getAi = (): GoogleGenAI => {
    if (!ai) {
        throw new Error("Gemini API Key not found or not initialized. Please set it in the admin settings page.");
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

// --- API Functions remain largely the same, but now rely on the async-loaded 'ai' instance ---

export const summarizeText = async (text: string): Promise<string> => {
    try {
        const model = getAi().getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Summarize the following text into a few concise bullet points:\n\n${text}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        handleApiError(error, "Failed to summarize text");
    }
};

export const checkGrammar = async (text: string): Promise<string> => {
    try {
        const model = getAi().getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Correct any grammar and spelling mistakes in the following text. Return only the corrected text without any introductory phrases:\n\n\"${text}\"`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        handleApiError(error, "Failed to check grammar");
    }
};

export const getTextFromImage = async (base64Image: string, mimeType: string): Promise<string> => {
    try {
        const model = getAi().getGenerativeModel({ model: "gemini-pro-vision" });
        const imagePart = { inlineData: { data: base64Image, mimeType } };
        const textPart = { text: "Extract all text from this image. If there is no text, say so." };
        const result = await model.generateContent([textPart, imagePart]);
        const response = await result.response;
        return response.text();
    } catch (error) {
        handleApiError(error, "Failed to extract text from image");
    }
};

export const getCurrencyConversion = async (amount: number, from: string, to: string): Promise<string> => {
    try {
        const model = getAi().getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Convert ${amount} ${from} to ${to}. Provide only the final converted numeric value, without currency symbols or any extra text.`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const numericResult = parseFloat(text.replace(/,/g, ''));
        if (isNaN(numericResult)) {
            throw new Error("AI returned a non-numeric value.");
        }
        return numericResult.toFixed(2);
    } catch (error) {
        handleApiError(error, "Failed to convert currency");
    }
};

export const createChat = (history?: Content[]): Chat => {
    try {
        const model = getAi().getGenerativeModel({ model: "gemini-pro" });
        return model.startChat({ history });
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
