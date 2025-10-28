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
        <div className="space-y-8">
            <ToolContainer title="Free AI Text Summarizer">
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
            <div className="prose dark:prose-invert max-w-none">
                <h2>How Our Text Summarizer Works</h2>
                <p>Our AI text summarizer uses advanced natural language processing to understand the context of your text and extract the most important information. Simply paste your text into the box above and click "Summarize Text" to get a concise summary in seconds.</p>
                <h3>Summarize Articles, Essays, and Documents Instantly</h3>
                <p>Whether you're a student, researcher, or professional, our summarizer tool can help you save time and get the information you need quickly. Summarize long articles, dense academic papers, or lengthy business documents with ease.</p>
                <h2>Key Features of Our Summarizer Tool</h2>
                <h3>AI-Powered Summarization</h3>
                <p>Our tool uses cutting-edge AI to provide summaries that are not only shorter but also capture the essence of the original text, often feeling like a human summarizer.</p>
                <h3>No Character Limit</h3>
                <p>Unlike other tools, our AI text summarizer has no limit on the number of characters you can summarize. Feel free to summarize even the longest documents.</p>
                <h3>Human-Like Summaries</h3>
                <p>We pride ourselves on providing summaries that are coherent, readable, and feel like they were written by a human. Our AI is trained to understand nuances and context, resulting in high-quality summaries.</p>
                <h2>Frequently Asked Questions</h2>
                <h3>What is a text summarizer?</h3>
                <p>A text summarizer is a tool that uses artificial intelligence to condense a long piece of text into a shorter, more manageable version, while retaining the most important information.</p>
                <h3>Is this text summarizer free?</h3>
                <p>Yes, our AI text summarizer is completely free to use with no character limit.</p>
                <h3>Can I summarize a PDF?</h3>
                <p>To summarize a PDF, you will first need to extract the text from the PDF. You can use our <a href="/image-to-text-converter">Image to Text converter</a> for image-based PDFs, and then paste the text into the summarizer.</p>

                <p>Improve your writing further with our <a href="/grammar-checker">Grammar Checker</a> or extract text from images before summarizing with our <a href="/image-to-text-converter">Image to Text converter</a>.</p>
            </div>
            <script type="application/ld+json">
                {`
                {
                  "@context": "https://schema.org",
                  "@type": "SoftwareApplication",
                  "name": "Free AI Text Summarizer",
                  "applicationCategory": "Productivity",
                  "operatingSystem": "Any",
                  "offers": {
                    "@type": "Offer",
                    "price": "0"
                  },
                  "description": "A free AI-powered text summarizer that shortens long articles, essays, and documents into concise, easy-to-read summaries.",
                  "url": "https://solver-hub.vercel.app/text-summarizer"
                }
                `}
            </script>
        </div>
    );
};

export default TextSummarizer;
