
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";

let ai: GoogleGenAI | null = null;

// This function initializes the GoogleGenAI instance on first use,
// preventing the app from crashing on load if the API key is not set.
const getAi = (): GoogleGenAI => {
    if (!ai) {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        // Per @google/genai guidelines, API key must be sourced from environment variables.
        if (!apiKey) {
            console.error("Gemini API key is not set in environment variables. AI features will be disabled.");
            throw new Error("Gemini API Key not found. Please set the VITE_GEMINI_API_KEY environment variable in your .env file.");
        }
        ai = new GoogleGenAI({ apiKey });
    }
    return ai;
};


/**
 * @deprecated This function is no longer needed as the Gemini service is now initialized automatically.
 */
export const initializeGeminiService = (apiKey: string): void => {
    // This function is intentionally left empty.
};


// Helper function to handle API errors consistently.
const handleApiError = (error: unknown, defaultMessage: string): never => {
    console.error(defaultMessage, error);
    if (error instanceof Error && error.message.includes("API Key not found")) {
        throw error;
    }
    throw new Error(`${defaultMessage}. Please try again.`);
};


export const summarizeText = async (text: string): Promise<string> => {
    try {
        const prompt = `Summarize the following text into a few concise bullet points:\n\n${text}`;
        const genAI = getAi();
        const model = genAI.getGenerativeModel({ model: "gemini-pro"});
        const result = await model.generateContent(prompt);
        const response = result.response;
        return response.text();
    } catch (error) {
        handleApiError(error, "Failed to summarize text");
    }
};

export const checkGrammar = async (text: string): Promise<string> => {
    try {
        const prompt = `Correct any grammar and spelling mistakes in the following text. Return only the corrected text without any introductory phrases:\n\n"${text}"`;
        const genAI = getAi();
        const model = genAI.getGenerativeModel({ model: "gemini-pro"});
        const result = await model.generateContent(prompt);
        const response = result.response;
        return response.text();
    } catch (error) {
        handleApiError(error, "Failed to check grammar");
    }
};

export const getTextFromImage = async (base64Image: string, mimeType: string): Promise<string> => {
    try {
        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType,
            },
        };
        const textPart = { text: "Extract all text from this image. If there is no text, say so." };

        const genAI = getAi();
        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
        const result = await model.generateContent([textPart, imagePart]);
        const response = result.response;
        return response.text();
    } catch (error) {
        handleApiError(error, "Failed to extract text from image");
    }
};

export const getCurrencyConversion = async (amount: number, from: string, to: string): Promise<string> => {
    try {
        const prompt = `Convert ${amount} ${from} to ${to}. Provide only the final converted numeric value, without currency symbols or any extra text.`;
        const genAI = getAi();
        const model = genAI.getGenerativeModel({ model: "gemini-pro"});
        const result = await model.generateContent(prompt);
        const response = result.response;
        const numericResult = parseFloat(response.text().replace(/,/g, ''));
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
        const genAI = getAi();
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const chat = model.startChat();
        return chat;
    } catch (error) {
        handleApiError(error, "Failed to create chat session");
    }
};

export const generateImage = async (prompt: string): Promise<string> => {
    try {
        // Note: Gemini text-to-image models are not generally available yet.
        // This is a placeholder for when they are.
        // You would use a model like "gemini-pro-vision" or a specific image model.
        // The following is a simulated response.
        console.warn("Image generation is not yet supported by the Gemini API in this example.");
        // Return a placeholder image
        return new Promise(resolve => setTimeout(() => resolve("/placeholder.jpg"), 1000));
        
    } catch (error) {
        handleApiError(error, "Failed to generate image");
    }
};
