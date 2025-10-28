import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";

// A singleton pattern for the AI instance to avoid re-initialization
let aiInstance: GoogleGenAI | null = null;
let isInitialized = false;
let initializationError: string | null = null;

const API_KEY_ERROR_MESSAGE = `AI features are disabled. The application requires a Google Gemini API Key to function. Please ensure the 'API_KEY' environment variable is set in your deployment environment.`;

// This function initializes the AI service and caches the instance. It does not throw.
const initializeAi = (): void => {
    // Only run initialization once.
    if (isInitialized) {
        return;
    }
    isInitialized = true;

// FIX: Use `process.env.API_KEY` as per the coding guidelines.
const API_KEY = import.meta.env.VITE_API_KEY;

    if (!API_KEY) {
        console.error("API_KEY is not set in environment variables. AI features will be disabled.");
        initializationError = API_KEY_ERROR_MESSAGE;
        return;
    }

    try {
        aiInstance = new GoogleGenAI({ apiKey: API_KEY });
    } catch (error) {
        console.error("Error initializing GoogleGenAI:", error);
        aiInstance = null; // Ensure instance is null on error
        initializationError = `Failed to initialize AI service. ${error instanceof Error ? error.message : 'Please check the API key and network connection.'}`;
    }
};

// Returns the AI instance or null if not available. Does not throw.
const getAi = (): GoogleGenAI | null => {
    if (!isInitialized) {
        initializeAi();
    }
    return aiInstance;
};

/**
 * Checks if the AI service is initialized and available.
 * @returns An object with `isAvailable` (boolean) and `errorMessage` (string | null).
 */
export const checkAiServiceAvailability = (): { isAvailable: boolean; errorMessage: string | null } => {
    if (!isInitialized) {
        initializeAi();
    }
    return { isAvailable: !!aiInstance, errorMessage: initializationError };
};

const model = 'gemini-2.5-flash';

// Helper function to handle API errors consistently.
const handleApiError = (error: unknown, defaultMessage: string): never => {
    console.error(defaultMessage, error);
    // The specific API key error is handled before this function is called.
    // For other errors, we throw a more generic message.
    throw new Error(`${defaultMessage}. Please try again.`);
};


export const summarizeText = async (text: string): Promise<string> => {
    const ai = getAi();
    if (!ai) {
        throw new Error(initializationError || API_KEY_ERROR_MESSAGE);
    }
    try {
        const prompt = `Summarize the following text into a few concise bullet points:\n\n${text}`;
        const response: GenerateContentResponse = await ai.models.generateContent({
            model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        handleApiError(error, "Failed to summarize text");
    }
};

export const checkGrammar = async (text: string): Promise<string> => {
    const ai = getAi();
    if (!ai) {
        throw new Error(initializationError || API_KEY_ERROR_MESSAGE);
    }
    try {
        const prompt = `Correct any grammar and spelling mistakes in the following text. Return only the corrected text without any introductory phrases:\n\n"${text}"`;
        const response: GenerateContentResponse = await ai.models.generateContent({
            model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        handleApiError(error, "Failed to check grammar");
    }
};

export const imageToText = async (base64Image: string, mimeType: string): Promise<string> => {
    const ai = getAi();
    if (!ai) {
        throw new Error(initializationError || API_KEY_ERROR_MESSAGE);
    }
    try {
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
        handleApiError(error, "Failed to extract text from image");
    }
};

export const getCurrencyConversion = async (amount: number, from: string, to: string): Promise<string> => {
    const ai = getAi();
    if (!ai) {
        throw new Error(initializationError || API_KEY_ERROR_MESSAGE);
    }
    try {
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
        handleApiError(error, "Failed to convert currency");
    }
};

// FIX: Added createChat function to initialize a new chat session.
export const createChat = (): Chat => {
    const ai = getAi();
    if (!ai) {
        throw new Error(initializationError || API_KEY_ERROR_MESSAGE);
    }
    return ai.chats.create({
        model: 'gemini-2.5-flash',
    });
};

// FIX: Added generateImage function to create images from a text prompt.
export const generateImage = async (prompt: string): Promise<string> => {
    const ai = getAi();
    if (!ai) {
        throw new Error(initializationError || API_KEY_ERROR_MESSAGE);
    }
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image was generated.");
        }
    } catch (error) {
        handleApiError(error, "Failed to generate image");
    }
};