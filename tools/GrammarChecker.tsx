import React, { useState, useCallback } from 'react';
import { checkGrammar } from '../services/geminiService';
import ToolContainer from './common/ToolContainer';
import ToolResult from './common/ToolResult';

const GrammarChecker: React.FC = () => {
    const [text, setText] = useState('');
    const [result, setResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCheck = useCallback(async () => {
        if (!text.trim()) {
            setError("Please enter some text to check.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const correctedText = await checkGrammar(text);
            setResult(correctedText);
        } catch (e) {
            setError(e instanceof Error ? e.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, [text]);

    return (
        <ToolContainer title="Check Your Grammar & Spelling">
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste your text here..."
                className="w-full h-48 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-slate-800 dark:border-slate-600 dark:text-light"
            />
            <button
                onClick={handleCheck}
                disabled={isLoading}
                className="w-full bg-primary text-white font-semibold px-6 py-3 rounded-md hover:bg-primary-dark transition-colors disabled:bg-gray-400"
            >
                {isLoading ? 'Checking...' : 'Fix Grammar'}
            </button>
            <ToolResult isLoading={isLoading} error={error} result={result} title="Corrected Text" />
        </ToolContainer>
    );
};

export default GrammarChecker;