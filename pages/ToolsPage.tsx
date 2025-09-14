import React, { useState, useMemo } from 'react';
import { TOOLS } from '../constants';
import { Tool, ToolCategory } from '../types';
import ToolCard from '../components/ToolCard';

const ToolsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'All'>('All');

    const categories = ['All', ...Object.values(ToolCategory)];

    const filteredTools = useMemo((): Tool[] => {
        return TOOLS.filter(tool => {
            const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
            const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || tool.description.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [searchTerm, selectedCategory]);

    return (
        <div className="bg-white dark:bg-dark py-12 sm:py-16 transition-colors duration-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-dark dark:text-light tracking-tight">All Tools</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-secondary dark:text-slate-400">
                        Find the perfect tool for your task. Search or filter by category.
                    </p>
                </div>

                <div className="mb-8 max-w-2xl mx-auto">
                    <input
                        type="text"
                        placeholder="Search for a tool..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-slate-800 dark:border-slate-600 dark:text-light"
                    />
                </div>

                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category as ToolCategory | 'All')}
                            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${
                                selectedCategory === category 
                                ? 'bg-primary text-white' 
                                : 'bg-gray-200 text-secondary hover:bg-gray-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {filteredTools.length > 0 ? (
                        filteredTools.map(tool => <ToolCard key={tool.id} tool={tool} />)
                    ) : (
                        <p className="text-center text-secondary dark:text-slate-400 md:col-span-2 lg:col-span-3">No tools found matching your criteria.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ToolsPage;