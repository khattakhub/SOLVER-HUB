import React, { useState, useCallback } from 'react';
import { mergePdfs } from '../utils/fileUtils';
import ToolContainer from './common/ToolContainer';

const PdfMerger: React.FC = () => {
    const [files, setFiles] = useState<FileList | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(e.target.files);
        }
    };

    const handleMerge = useCallback(async () => {
        if (!files || files.length < 2) {
            setError("Please select at least two PDF files to merge.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const mergedPdf = await mergePdfs(Array.from(files));
            const url = URL.createObjectURL(mergedPdf);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'merged.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (e) {
            setError(e instanceof Error ? e.message : "An unknown error occurred while merging PDFs.");
        } finally {
            setIsLoading(false);
        }
    }, [files]);

    return (
        <div className="space-y-8">
            <ToolContainer title="PDF Merger">
                <div className="space-y-4">
                    <input type="file" onChange={handleFileChange} multiple accept=".pdf" className="w-full" />
                    <button onClick={handleMerge} disabled={isLoading || !files} className="w-full bg-primary text-white font-semibold px-6 py-3 rounded-md hover:bg-primary-dark transition-colors disabled:bg-gray-400">
                        {isLoading ? 'Merging...' : 'Merge PDFs and Download'}
                    </button>
                </div>
                {error && (
                    <div className="p-4 bg-red-100 text-red-700 rounded-md">
                        <p>{error}</p>
                    </div>
                )}
            </ToolContainer>
            <div className="prose dark:prose-invert max-w-none">
                <h2>About PDF Merger</h2>
                <p>Combine multiple PDF files into a single document. Select two or more PDF files, and the tool will merge them in the order you selected them.</p>
            </div>
        </div>
    );
};

export default PdfMerger;
