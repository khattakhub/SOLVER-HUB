import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;
let apiKeyError: string | null = "AI features are disabled. Please configure the Gemini API Key in the admin settings panel.";

/**
 * Initializes the GoogleGenAI instance. This function is called from the SiteSettingsContext
 * once the API key has been fetched from Firestore.
 * @param apiKey The Google Gemini API key.
 */
export const initializeGeminiService = (apiKey: string): void => {
    if (!apiKey || !apiKey.trim()) {
        aiInstance = null;
        apiKeyError = "AI features are disabled. Please configure the Gemini API Key in the admin settings panel.";
        return;
    }

    try {
        aiInstance = new GoogleGenAI({ apiKey });
        apiKeyError = null; // Success! Clear any previous errors.
    } catch (error) {
        console.error("Error initializing GoogleGenAI:", error);
        aiInstance = null;
        apiKeyError = "Failed to initialize Gemini service. The API Key might be invalid.";
    }
};


// Returns the AI instance or null if not available. Does not throw.
const getAi = (): GoogleGenAI | null => {
    return aiInstance;
};

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
        throw new Error(apiKeyError as string);
    }
    try {
        const prompt = `Summarize the following text into a few concise bullet points:\n\n${text}`;
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
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
        throw new Error(apiKeyError as string);
    }
    try {
        const prompt = `Correct any grammar and spelling mistakes in the following text. Return only the corrected text without any introductory phrases:\n\n"${text}"`;
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        handleApiError(error, "Failed to check grammar");
    }
};

export const getTextFromImage = async (base64Image: string, mimeType: string): Promise<string> => {
    const ai = getAi();
    if (!ai) {
        throw new Error(apiKeyError as string);
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
            model: 'gemini-2.5-flash',
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
        throw new Error(apiKeyError as string);
    }
    try {
        const prompt = `Convert ${amount} ${from} to ${to}. Provide only the final converted numeric value, without currency symbols or any extra text.`;
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
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

export const createChat = (): Chat => {
    const ai = getAi();
    if (!ai) {
        throw new Error(apiKeyError as string);
    }
    try {
        const chat: Chat = ai.chats.create({
            model: 'gemini-2.5-flash',
        });
        return chat;
    } catch (error) {
        handleApiError(error, "Failed to create chat session");
    }
};

export const generateImage = async (prompt: string): Promise<string> => {
    const ai = getAi();
    if (!ai) {
        throw new Error(apiKeyError as string);
    }
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/png',
            },
        });

        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
        return imageUrl;
    } catch (error) {
        handleApiError(error, "Failed to generate image");
    }
};