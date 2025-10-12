import React, { useState, useCallback } from 'react';
import { generateImage } from '../services/geminiService';
import ToolContainer from './common/ToolContainer';

const ImageGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!prompt.trim()) {
            setError("Please enter a prompt to generate an image.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setImageUrl(null);
        try {
            const url = await generateImage(prompt);
            setImageUrl(url);
        } catch (e) {
            setError(e instanceof Error ? e.message : "An unknown error occurred while generating the image.");
        } finally {
            setIsLoading(false);
        }
    }, [prompt]);

    return (
        <ToolContainer title="Create an Image from Text">
            <div className="flex">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                    placeholder="e.g., A cute cat wearing a wizard hat"
                    className="flex-grow p-3 border border-r-0 border-gray-300 rounded-l-md focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-slate-800 dark:border-slate-600 dark:text-light"
                    disabled={isLoading}
                />
                <button
                    onClick={handleGenerate}
                    disabled={isLoading || !prompt.trim()}
                    className="bg-primary text-white font-semibold px-6 py-3 rounded-r-md hover:bg-primary-dark transition-colors disabled:bg-gray-400"
                >
                    {isLoading ? 'Generating...' : 'Generate'}
                </button>
            </div>

            {isLoading && (
                <div className="w-full p-4 bg-gray-100 dark:bg-slate-800 rounded-md animate-pulse min-h-[256px] flex items-center justify-center">
                    <p className="text-secondary dark:text-slate-400">Creating your image... this may take a moment.</p>
                </div>
            )}

            {error && (
                <div className="w-full p-4 bg-red-100 text-red-700 rounded-md border border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700">
                    <p className="whitespace-pre-wrap"><strong>Error:</strong> {error}</p>
                </div>
            )}

            {imageUrl && !isLoading && (
                <div>
                    <h3 className="text-lg font-semibold text-dark dark:text-light mb-2">Generated Image</h3>
                    <div className="w-full p-2 bg-gray-100 dark:bg-slate-800 rounded-md border dark:border-slate-700">
                        <img src={imageUrl} alt={prompt} className="rounded-md w-full h-auto" />
                    </div>
                </div>
            )}
        </ToolContainer>
    );
};

export default ImageGenerator;