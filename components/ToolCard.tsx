import React from 'react';
// Fix: Use namespace import for react-router-dom to avoid module resolution errors.
import * as ReactRouterDOM from 'react-router-dom';
import { Tool } from '../types';

interface ToolCardProps {
    tool: Tool;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
    return (
        <ReactRouterDOM.Link 
            to={`/tools/${tool.id}`} 
            className="group block bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-200 dark:border-slate-700"
        >
            <div className="flex items-center space-x-4">
                <div className="bg-sky-100 dark:bg-slate-700 p-3 rounded-lg">
                    {tool.icon}
                </div>
                <div>
                    <h3 className="text-lg font-bold text-dark dark:text-light group-hover:text-primary transition-colors duration-300">{tool.name}</h3>
                    <p className="text-sm text-secondary dark:text-slate-400 mt-1">{tool.description}</p>
                </div>
            </div>
        </ReactRouterDOM.Link>
    );
};

export default ToolCard;