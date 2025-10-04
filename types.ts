
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
  id?: string;
  idea: string;
  description: string;
  date: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  message: string;
  date: string;
}