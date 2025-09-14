import React from 'react';

interface ToolContainerProps {
    title: string;
    children: React.ReactNode;
}

const ToolContainer: React.FC<ToolContainerProps> = ({ title, children }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-dark dark:text-light mb-6 text-center">{title}</h2>
            <div className="space-y-6">{children}</div>
        </div>
    );
};

export default ToolContainer;