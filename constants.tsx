
import React from 'react';
import { Tool, ToolCategory } from './types';
import { SummarizeIcon, GrammarIcon, OcrIcon, UnitConvertIcon, CurrencyIcon, PdfIcon, ChatIcon } from './components/icons';

import TextSummarizer from './tools/TextSummarizer';
import GrammarChecker from './tools/GrammarChecker';
import ImageToTextConverter from './tools/ImageToTextConverter';
import UnitConverter from './tools/UnitConverter';
import CurrencyConverter from './tools/CurrencyConverter';
import PdfMerger from './tools/PdfMerger';
import AiChatBot from './tools/AiChatBot';

export const TOOLS: Tool[] = [
    {
        id: 'text-summarizer',
        name: 'Text Summarizer',
        description: 'Summarize long text into concise key points using AI.',
        icon: <SummarizeIcon className="w-8 h-8 text-primary" />,
        category: ToolCategory.AI,
        component: TextSummarizer,
        isFeatured: true,
    },
    {
        id: 'grammar-spell-checker',
        name: 'Grammar & Spell Checker',
        description: 'Fix grammatical errors and spelling mistakes in your text.',
        icon: <GrammarIcon className="w-8 h-8 text-primary" />,
        category: ToolCategory.AI,
        component: GrammarChecker,
        isFeatured: true,
    },
    {
        id: 'image-to-text',
        name: 'Image to Text (OCR)',
        description: 'Extract text from any image with high accuracy.',
        icon: <OcrIcon className="w-8 h-8 text-primary" />,
        category: ToolCategory.AI,
        component: ImageToTextConverter,
        isFeatured: true,
    },
    {
        id: 'unit-converter',
        name: 'Unit Converter',
        description: 'Convert various units of length, weight, temperature, and more.',
        icon: <UnitConvertIcon className="w-8 h-8 text-primary" />,
        category: ToolCategory.CONVERTERS,
        component: UnitConverter,
        isFeatured: true,
    },
    {
        id: 'currency-converter',
        name: 'Currency Converter',
        description: 'Convert currencies with the latest exchange rates.',
        icon: <CurrencyIcon className="w-8 h-8 text-primary" />,
        category: ToolCategory.CONVERTERS,
        component: CurrencyConverter,
        isFeatured: true,
    },
    {
        id: 'pdf-merger',
        name: 'PDF Merger',
        description: 'Combine multiple PDF files into a single document easily.',
        icon: <PdfIcon className="w-8 h-8 text-primary" />,
        category: ToolCategory.DOCUMENTS,
        component: PdfMerger,
        isFeatured: true,
    },
    {
        id: 'ai-chat-bot',
        name: 'AI Answer Bot',
        description: 'Get instant answers and suggestions for any question.',
        icon: <ChatIcon className="w-8 h-8 text-primary" />,
        category: ToolCategory.AI,
        component: AiChatBot,
        isFeatured: true,
    },
];

export const NAV_LINKS = [
    { name: 'Home', path: '/' },
    { name: 'All Tools', path: '/tools' },
    { name: 'Future Tools', path: '/future' }
];

export const SOCIAL_LINKS = {
    twitter: '#',
    github: '#',
    linkedin: '#',
};
