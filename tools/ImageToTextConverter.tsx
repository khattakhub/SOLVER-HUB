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
        <ToolContainer title="Free Image to Text Converter (OCR)">
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
            <div className="prose dark:prose-invert max-w-none mt-8">
                <h2>How to Convert Image to Text Online</h2>
                <p>Our free image to text converter uses advanced Optical Character Recognition (OCR) technology to extract text from images. This OCR online tool makes it easy to convert a photo to text. Simply upload your image, and our image to text AI will do the rest.</p>
                <h3>Upload, Convert, and Copy</h3>
                <p>The process is simple: upload an image, click "Extract Text," and our tool will provide you with editable text that you can copy and use as you wish. It is the best way to get text from an image for free.</p>
                <h2>Features of Our OCR Technology</h2>
                <h3>High Accuracy with AI</h3>
                <p>Our image to text AI is designed for high accuracy, ensuring that you get a reliable text version of your image. It is a powerful photo to text converter that you can trust.</p>
                <h3>Supports Various Image Formats</h3>
                <p>We support a wide range of image formats, including JPG, PNG, and more. You can even use it to extract text from a PDF image.</p>
                <h3>From Photo to Text in Seconds</h3>
                <p>Our tool is fast and efficient, converting your images to text in just a few seconds. It's the quickest way to turn a photo into text.</p>
                <h2>Use Cases for Our Image to Text Converter</h2>
                <p>This tool is perfect for students, professionals, and anyone who needs to extract text from images. You can use it to digitize notes, extract information from business cards, and much more. After extracting, you can summarize the text with our <a href="/text-summarizer">Text Summarizer</a> or merge multiple image-based PDFs into one with our <a href="/pdf-merger">PDF Merger</a>.</p>
            </div>
            <script type="application/ld+json">
                {`
                {
                    "@context": "https://schema.org",
                    "@type": "SoftwareApplication",
                    "name": "Image to Text Converter (OCR)",
                    "applicationCategory": "Productivity",
                    "operatingSystem": "Any",
                    "offers": {
                        "@type": "Offer",
                        "price": "0"
                    },
                    "description": "Extract text from any image using advanced OCR (Optical Character Recognition) technology. Upload your image, and the tool instantly converts it into editable and copyable text.",
                    "url": "https://solver-hub.vercel.app/image-to-text-converter"
                }
                `}
            </script>
        </ToolContainer>
    );
};

export default ImageToTextConverter;