
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

export interface Suggestion {
  id: number;
  idea: string;
  description: string;
  date: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  date: string;
}
