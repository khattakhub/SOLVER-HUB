
import React from 'react';

export enum ToolCategory {
    AI = 'AI',
    CONVERTERS = 'Converters',
    DOCUMENTS = 'Documents',
    UTILITIES = 'Utilities'
}

export interface Tool {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    category: ToolCategory;
    component: React.LazyExoticComponent<React.ComponentType<any>>;
    isFeatured?: boolean;
}