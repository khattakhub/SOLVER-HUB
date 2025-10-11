import React from 'react';
import { CodeIcon } from './icons';

const LoadingIndicator: React.FC = () => (
    <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <div>
            <CodeIcon 
                className="w-32 h-32 text-primary dark:text-sky-400"
                leftChevronClass="animate-chevron-left"
                rightChevronClass="animate-chevron-right"
            />
        </div>
    </div>
);

export default LoadingIndicator;