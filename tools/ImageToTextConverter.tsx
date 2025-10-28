import React, { useState, useCallback } from 'react';
import ToolContainer from './common/ToolContainer';
import ToolResult from './common/ToolResult';
import { imageToText } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';

const ImageToTextConverter: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleConvert = useCallback(async () => {
        if (!file) {
            setError("Please select a file.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const base64String = await fileToBase64(file);
            const text = await imageToText(base64String, file.type);
            setResult(text);
        } catch (e) {
            setError(e instanceof Error ? e.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, [file]);

    return (
        <div className="space-y-8">
            <ToolContainer title="Image to Text (OCR)">
                <div className="space-y-4">
                    <input type="file" onChange={handleFileChange} accept="image/*" className="w-full" />
                    <button onClick={handleConvert} disabled={isLoading || !file} className="w-full bg-primary text-white font-semibold px-6 py-3 rounded-md hover:bg-primary-dark transition-colors disabled:bg-gray-400">
                        {isLoading ? 'Converting...' : 'Convert Image to Text'}
                    </button>
                </div>
                <ToolResult isLoading={isLoading} error={error} result={result} title="Extracted Text" />
            </ToolContainer>
            <div className="prose dark:prose-invert max-w-none">
                <h2>About Image to Text Converter</h2>
                <p>This tool allows you to extract text from images using Optical Character Recognition (OCR). Upload an image, and the AI will recognize and convert the text into a digital format.</p>
            </div>
        </div>
    );
};

export default ImageToTextConverter;