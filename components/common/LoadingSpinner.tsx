import React from 'react';
import { CodeIcon } from '../icons';

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-screen">
        <div className="relative w-24 h-24 overflow-hidden">
            <CodeIcon className="w-24 h-24 text-primary" />
            <div 
                className="absolute top-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent transform -skew-x-12"
                style={{animation: 'shine 2s infinite linear'}}
            />
        </div>
    </div>
);

export default LoadingSpinner;
