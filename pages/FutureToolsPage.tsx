import React from 'react';

const futureTools = [
    { name: 'AI Image Generator', description: 'Create stunning images from text prompts.' },
    { name: 'Video Summarizer', description: 'Get key points from long videos instantly.' },
    { name: 'Code Formatter', description: 'Automatically format code in various languages.' },
    { name: 'PDF Split & Compress', description: 'More advanced tools for PDF management.' },
    { name: 'JSON/CSV Converter', description: 'Easily convert data between formats.' },
    { name: 'Password Generator', description: 'Create strong, secure passwords.' },
];

const FutureToolsPage: React.FC = () => {
    return (
        <div className="bg-white dark:bg-dark py-12 sm:py-16 transition-colors duration-300 fade-in">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-dark dark:text-light tracking-tight">Future Tools</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-secondary dark:text-slate-400">
                        We're constantly working on new features. Here's a sneak peek at what's coming soon!
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
                    {futureTools.map((tool, index) => (
                        <div key={index} className="bg-gray-100 dark:bg-slate-800 p-6 rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-600">
                            <h3 className="text-lg font-bold text-dark dark:text-light">{tool.name}</h3>
                            <p className="text-sm text-secondary dark:text-slate-400 mt-1">{tool.description}</p>
                            <div className="mt-4 bg-gray-300 dark:bg-slate-700 text-gray-500 dark:text-slate-400 text-xs font-bold px-2 py-1 rounded-full inline-block">
                                COMING SOON
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="max-w-xl mx-auto bg-sky-50 dark:bg-slate-900 p-8 rounded-lg">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-dark dark:text-light">Have an Idea?</h2>
                        <p className="mt-2 text-md text-secondary dark:text-slate-400">Suggest a new tool you'd like to see on SolverHub.</p>
                    </div>
                    <form className="mt-8 space-y-6">
                        <input type="text" placeholder="Tool Name / Idea" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-slate-800 dark:border-slate-600 dark:text-light" />
                        <textarea placeholder="Describe the tool..." rows={4} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-slate-800 dark:border-slate-600 dark:text-light"></textarea>
                        <div className="text-center">
                            <button type="submit" className="bg-primary text-white font-semibold px-8 py-3 rounded-md hover:bg-primary-dark transition-colors duration-300 shadow-lg">
                                Submit Suggestion
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FutureToolsPage;