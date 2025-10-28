import React, { useState, useCallback } from 'react';
import ToolContainer from './common/ToolContainer';

// pdf-lib is loaded from CDN in index.html, we declare it here for TypeScript
declare const PDFLib: any;

const PdfMerger: React.FC = () => {
    const [files, setFiles] = useState<FileList | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFiles(e.target.files);
        setError(null);
    };

    const handleMerge = useCallback(async () => {
        if (!files || files.length < 2) {
            setError("Please select at least two PDF files to merge.");
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            const { PDFDocument } = PDFLib;
            const mergedPdf = await PDFDocument.create();

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }

            const mergedPdfBytes = await mergedPdf.save();
            
            const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'merged.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? e.message : "Failed to merge PDFs. Please ensure they are valid files.");
        } finally {
            setIsLoading(false);
        }
    }, [files]);

    return (
        <ToolContainer title="Merge PDF Files Online for Free">
            <div className="flex flex-col items-center">
                 <label htmlFor="pdf-upload" className="w-full p-6 text-center border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800">
                    <p className="text-secondary dark:text-slate-400">
                        {files && files.length > 0 
                            ? `${files.length} file(s) selected` 
                            : 'Click to select PDF files'}
                    </p>
                    <span className="text-sm text-gray-500 dark:text-slate-500">You can select multiple files</span>
                </label>
                <input
                    type="file"
                    id="pdf-upload"
                    accept="application/pdf"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                />
                {files && files.length > 0 && (
                    <ul className="mt-4 list-disc list-inside bg-gray-50 dark:bg-slate-800 p-3 rounded-md w-full">
                        {/* Fix: Explicitly type 'file' as File to resolve type inference issue. */}
                        {Array.from(files).map((file: File) => <li key={file.name} className="text-sm text-secondary dark:text-slate-400">{file.name}</li>)}
                    </ul>
                )}
            </div>
             <button
                onClick={handleMerge}
                disabled={isLoading || !files || files.length < 2}
                className="w-full bg-primary text-white font-semibold px-6 py-3 rounded-md hover:bg-primary-dark transition-colors disabled:bg-gray-400"
            >
                {isLoading ? 'Merging...' : 'Merge & Download PDFs'}
            </button>
            {error && (
                <div className="w-full p-4 bg-red-100 text-red-700 rounded-md border border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700">
                    <p className="whitespace-pre-wrap"><strong>Error:</strong> {error}</p>
                </div>
            )}
            <div className="prose dark:prose-invert max-w-none mt-8">
                <h2>How to Merge PDF Files Online</h2>
                <p>Our PDF merger allows you to combine multiple PDF files into a single document. This is a great alternative to tools like the Adobe PDF merger or I Love PDF merger, and it's completely free. You can also compress PDFs or split PDFs using other tools, but our focus is on providing a simple and efficient PDF merge free download experience.</p>
                <h3>Select, Merge, and Download</h3>
                <p>To get started, simply select the PDF files you want to merge. You can also merge JPG files by first converting them to PDF. Once you have selected your files, click the "Merge & Download PDFs" button to get your merged document.</p>
                <h2>Features of Our PDF Merger</h2>
                <h3>Fast and Secure</h3>
                <p>Our tool is designed to be fast and secure. We process your files in your browser, so they are never uploaded to our servers. This ensures that your data remains private and secure.</p>
                <h3>High-Quality Merging</h3>
                <p>We ensure that your merged PDF retains its original quality. There is no loss of resolution or formatting during the merging process.</p>
                <h2>Why Use Our PDF Merger?</h2>
                <p>Our PDF merger is a simple and reliable tool for combining multiple PDFs into one. It's perfect for students, professionals, and anyone who needs to manage their documents efficiently. After merging, you can extract text from your PDF using our <a href="/image-to-text-converter">Image to Text converter</a>.</p>
            </div>
            <script type="application/ld+json">
                {`
                {
                    "@context": "https://schema.org",
                    "@type": "SoftwareApplication",
                    "name": "PDF Merger Free",
                    "applicationCategory": "Productivity",
                    "operatingSystem": "Any",
                    "offers": {
                        "@type": "Offer",
                        "price": "0"
                    },
                    "description": "Combine multiple PDF files into a single document effortlessly. Fast, secure, and completely free — merge, organize, and download your PDFs in one click without losing quality.",
                    "url": "https://solver-hub.vercel.app/pdf-merger"
                }
                `}
            </script>
        </ToolContainer>
    );
};

export default PdfMerger;