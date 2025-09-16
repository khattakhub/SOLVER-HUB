import React from 'react';

interface ToolResultProps {
    isLoading: boolean;
    error: string | null;
    result: string | null;
    title?: string;
}

const ToolResult: React.FC<ToolResultProps> = ({ isLoading, error, result, title = "Result" }) => {
    if (isLoading) {
        return (
            <div>
                <h3 className="text-lg font-semibold text-dark dark:text-light mb-2">{title}</h3>
                <div className="w-full p-4 bg-gray-100 dark:bg-slate-800 rounded-md animate-pulse min-h-[100px] flex items-center justify-center">
                    <p className="text-secondary dark:text-slate-400">Generating response...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <h3 className="text-lg font-semibold text-dark dark:text-light mb-2">{title}</h3>
                <div className="w-full p-4 bg-red-100 text-red-700 rounded-md border border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700">
                    <p className="whitespace-pre-wrap"><strong>Error:</strong> {error}</p>
                </div>
            </div>
        );
    }

    if (result) {
        return (
            <div>
                <h3 className="text-lg font-semibold text-dark dark:text-light mb-2">{title}</h3>
                <div className="w-full p-4 bg-sky-50 rounded-md border border-sky-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                    {result}
                </div>
            </div>
        );
    }

    return null;
};

export default ToolResult;