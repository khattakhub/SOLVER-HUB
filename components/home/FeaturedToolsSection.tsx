import React, { Suspense } from 'react';
import { TOOLS } from '../../constants';
import ToolCard from '../ToolCard';

const FeaturedToolsSection: React.FC = () => {
    const featuredTools = TOOLS.filter(tool => tool.isFeatured);

    return (
        <section className="py-16 sm:py-20 bg-sky-50 dark:bg-slate-900 transition-colors duration-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-dark dark:text-light">Featured Tools</h2>
                    <p className="mt-2 text-md text-secondary dark:text-slate-400">Our most popular tools to get you started.</p>
                </div>
                <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {featuredTools.map(tool => (
                        <ToolCard key={tool.id} tool={tool} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedToolsSection;
