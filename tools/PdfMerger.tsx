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
        <ToolContainer title="Merge PDF Files">
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
        </ToolContainer>
    );
};

export default PdfMerger;