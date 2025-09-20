import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

// A singleton pattern for the AI instance to avoid re-initialization
let aiInstance: GoogleGenAI | null = null;

const API_KEY_ERROR_MESSAGE = `Configuration Error: AI features are disabled. The application requires a Google Gemini API Key to function.

Please ensure the 'API_KEY' environment variable is set in your deployment environment.

For example, if deploying on Vercel:
1. Go to your Project Settings.
2. Navigate to 'Environment Variables'.
3. Add a variable named 'API_KEY' with your key as the value.
4. Redeploy your application.`;

// This function initializes the AI service and caches the instance.
const initializeAi = (): void => {
    // Only run initialization once.
    if (aiInstance) {
        return;
    }

    // FIX: The API key must be obtained from process.env.API_KEY. This also resolves the TypeScript error with import.meta.env.
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
        // Update error message to refer to the correct environment variable.
        console.error("API_KEY is not set in environment variables. AI features will not work.");
        return;
    }

    try {
        aiInstance = new GoogleGenAI({ apiKey });
    } catch (error) {
        console.error("Error initializing GoogleGenAI:", error);
    }
};

const getAi = (): GoogleGenAI => {
    // Initialize on first call.
    initializeAi();

    if (!aiInstance) {
        // This error will now be displayed inside each tool's result area instead of a global banner.
        // FIX: Update error message to refer to API_KEY environment variable.
        throw new Error(API_KEY_ERROR_MESSAGE);
    }
    return aiInstance;
};

const model = 'gemini-2.5-flash';

// Helper function to handle API errors consistently.
const handleApiError = (error: unknown, defaultMessage: string): never => {
    console.error(defaultMessage, error);
    // If it's the specific API key configuration error, re-throw it to be displayed in the UI.
    if (error instanceof Error && error.message.includes("Configuration Error")) {
       throw error;
    }
    // For other errors, throw a more generic message.
    throw new Error(`${defaultMessage}. Please try again.`);
};


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
        handleApiError(error, "Failed to summarize text");
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
        handleApiError(error, "Failed to check grammar");
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
        handleApiError(error, "Failed to extract text from image");
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
        handleApiError(error, "Failed to convert currency");
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
        handleApiError(error, "Failed to generate image");
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
