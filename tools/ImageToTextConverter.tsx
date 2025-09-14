import React, { useState, useCallback } from 'react';
import { getTextFromImage } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';
import ToolContainer from './common/ToolContainer';
import ToolResult from './common/ToolResult';

const ImageToTextConverter: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setError(null);
            setResult(null);
        }
    };

    const handleExtract = useCallback(async () => {
        if (!file) {
            setError("Please select an image file.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const base64Image = await fileToBase64(file);
            const extractedText = await getTextFromImage(base64Image, file.type);
            setResult(extractedText);
        } catch (e) {
            setError(e instanceof Error ? e.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, [file]);

    return (
        <ToolContainer title="Upload an Image to Extract Text">
            <div className="flex flex-col items-center">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-secondary dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-100 file:text-primary hover:file:bg-sky-200 dark:file:bg-slate-700 dark:file:text-sky-300 dark:hover:file:bg-slate-600"
                />
                {preview && (
                    <div className="mt-4 border p-2 rounded-md bg-gray-50 dark:bg-slate-800 dark:border-slate-700">
                        <img src={preview} alt="Selected preview" className="max-h-60 rounded-md" />
                    </div>
                )}
            </div>
            <button
                onClick={handleExtract}
                disabled={isLoading || !file}
                className="w-full bg-primary text-white font-semibold px-6 py-3 rounded-md hover:bg-primary-dark transition-colors disabled:bg-gray-400"
            >
                {isLoading ? 'Extracting...' : 'Extract Text'}
            </button>
            <ToolResult isLoading={isLoading} error={error} result={result} title="Extracted Text" />
        </ToolContainer>
    );
};

export default ImageToTextConverter;