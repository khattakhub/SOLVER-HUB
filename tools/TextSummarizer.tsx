import React, { useState, useCallback } from 'react';
import { summarizeText } from '../services/geminiService';
import ToolContainer from './common/ToolContainer';
import ToolResult from './common/ToolResult';

const TextSummarizer: React.FC = () => {
    const [text, setText] = useState('');
    const [result, setResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSummarize = useCallback(async () => {
        if (!text.trim()) {
            setError("Please enter some text to summarize.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const summary = await summarizeText(text);
            setResult(summary);
        } catch (e) {
            setError(e instanceof Error ? e.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, [text]);

    return (
        <ToolContainer title="Enter Text to Summarize">
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your long text here..."
                className="w-full h-48 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-slate-800 dark:border-slate-600 dark:text-light"
            />
            <button
                onClick={handleSummarize}
                disabled={isLoading}
                className="w-full bg-primary text-white font-semibold px-6 py-3 rounded-md hover:bg-primary-dark transition-colors disabled:bg-gray-400"
            >
                {isLoading ? 'Summarizing...' : 'Summarize Text'}
            </button>
            <ToolResult isLoading={isLoading} error={error} result={result} title="Summary" />
        </ToolContainer>
    );
};

export default TextSummarizer;