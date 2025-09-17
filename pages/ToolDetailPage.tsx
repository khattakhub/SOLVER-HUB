import React from 'react';
// Fix: Use namespace import for react-router-dom to avoid module resolution errors.
import * as ReactRouterDOM from 'react-router-dom';
import { TOOLS } from '../constants';

const ToolDetailPage: React.FC = () => {
    const { toolId } = ReactRouterDOM.useParams<{ toolId: string }>();
    const tool = TOOLS.find(t => t.id === toolId);

    if (!tool) {
        return (
            <div className="bg-white dark:bg-dark py-16 transition-colors duration-300 fade-in">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <h1 className="text-3xl font-bold text-dark dark:text-light">Tool Not Found</h1>
                    <p className="mt-4 text-secondary dark:text-slate-400">The tool you are looking for does not exist.</p>
                    <ReactRouterDOM.Link to="/tools" className="mt-6 inline-block bg-primary text-white font-semibold px-6 py-2 rounded-md hover:bg-primary-dark transition-colors">
                        Back to All Tools
                    </ReactRouterDOM.Link>
                </div>
            </div>
        );
    }

    const ToolComponent = tool.component;

    return (
        <div className="bg-sky-50 dark:bg-slate-900 min-h-full py-12 sm:py-16 transition-colors duration-300 fade-in">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <ReactRouterDOM.Link to="/tools" className="text-primary hover:underline mb-6 inline-block font-semibold">
                        &larr; Back to All Tools
                    </ReactRouterDOM.Link>
                    <div className="text-center mb-8">
                        <div className="inline-flex bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
                          {tool.icon}
                        </div>
                        <h1 className="text-4xl font-extrabold text-dark dark:text-light tracking-tight mt-4">{tool.name}</h1>
                        <p className="mt-2 max-w-2xl mx-auto text-lg text-secondary dark:text-slate-400">{tool.description}</p>
                    </div>
                    
                    <div className="bg-white dark:bg-dark p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700">
                        <ToolComponent />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ToolDetailPage;