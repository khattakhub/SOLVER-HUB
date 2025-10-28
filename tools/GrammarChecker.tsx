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
        <ToolContainer title="Free Online Grammar and Spell Checker">
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
            <div className="prose dark:prose-invert max-w-none mt-8">
                <h2>Why Use Our Free Grammar and Spell Checker?</h2>
                <p>Our free online grammar and spell checker helps you write better by identifying and correcting errors in your text. Whether you're writing an email, an essay, or a report, our tool ensures your writing is clear, concise, and error-free. We offer the best grammar checker capabilities to improve your writing.</p>
                <h3>Instant and Accurate AI-Powered Corrections</h3>
                <p>Using advanced AI, our tool provides instant feedback on your writing. It's more than just a spell check; it performs a sentence grammar check to ensure your sentences are well-structured and grammatically correct.</p>
                <h2>Perfect for Everyone</h2>
                <h3>For Students</h3>
                <p>Ensure your essays and assignments are polished and professional. Our tool helps you avoid common grammar mistakes and improve your grades.</p>
                <h3>For Professionals</h3>
                <p>From emails to reports, clear communication is key in the business world. Our grammar checker helps you write with confidence and clarity.</p>
                <h3>For Bloggers and Content Creators</h3>
                <p>Create high-quality content that is free of distracting errors. Our tool helps you maintain a professional image and engage your audience.</p>
                <h2>How to Check Your Grammar Online Free</h2>
                <p>Simply type or paste your text into the text area above and click the "Fix Grammar" button. Our tool will instantly analyze your text and provide you with the corrected version. You can also summarize your corrected text with our <a href="/text-summarizer">Text Summarizer</a>.</p>
            </div>
            <script type="application/ld+json">
                {`
                {
                    "@context": "https://schema.org",
                    "@type": "SoftwareApplication",
                    "name": "Free Grammar & Spell Checker",
                    "applicationCategory": "Productivity",
                    "operatingSystem": "Any",
                    "offers": {
                        "@type": "Offer",
                        "price": "0"
                    },
                    "description": "A free online grammar and spell checker that detects and corrects spelling, punctuation, and grammar errors instantly.",
                    "url": "https://solver-hub.vercel.app/grammar-checker"
                }
                `}
            </script>
        </ToolContainer>
    );
};

export default GrammarChecker;
