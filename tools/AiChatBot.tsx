import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Chat } from '@google/genai';
import { createChat, generateImage } from '../services/geminiService';
import ToolContainer from './common/ToolContainer';
import { ImageIcon, BotIcon } from '../components/icons';

interface Message {
    sender: 'user' | 'bot';
    text: string;
    imageUrl?: string;
}

const TypingIndicator: React.FC = () => (
    <div className="flex items-center space-x-1 p-2">
        <span className="w-2 h-2 bg-slate-500 dark:bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-2 h-2 bg-slate-500 dark:bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-2 h-2 bg-slate-500 dark:bg-slate-400 rounded-full animate-bounce"></span>
    </div>
);


const AiChatBot: React.FC = () => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [initializationError, setInitializationError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        try {
            setChat(createChat());
            setMessages([{ sender: 'bot', text: "Hello! I'm the AI Answer Bot. Ask me anything, or create an image by typing `/imagine` followed by a description." }]);
        } catch (e) {
            const errorText = e instanceof Error ? e.message : 'Sorry, something went wrong during initialization.';
            setInitializationError(errorText);
            setMessages([{ sender: 'bot', text: `Error: ${errorText}` }]);
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleImagineClick = useCallback(() => {
        setInput('/imagine ');
        inputRef.current?.focus();
    }, []);

    const handleSend = useCallback(async () => {
        if (!input.trim() || isLoading || initializationError) return;

        const userMessageText = input;
        const userMessage: Message = { sender: 'user', text: userMessageText };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        if (userMessageText.trim().startsWith('/imagine ')) {
            const prompt = userMessageText.trim().substring(8).trim();
            if (!prompt) {
                setMessages(prev => [...prev, { sender: 'bot', text: 'Please provide a description for the image after `/imagine`.' }]);
                setIsLoading(false);
                return;
            }
            
            try {
                const imageUrl = await generateImage(prompt);
                setMessages(prev => [...prev, { 
                    sender: 'bot', 
                    text: `Here is your image for: "${prompt}"`,
                    imageUrl: imageUrl 
                }]);
            } catch (e) {
                const errorText = e instanceof Error ? e.message : 'Sorry, something went wrong while generating the image.';
                setMessages(prev => [...prev, { sender: 'bot', text: `Error: ${errorText}` }]);
            } finally {
                setIsLoading(false);
            }
        } else {
            if (!chat) {
                setMessages(prev => [...prev, { sender: 'bot', text: 'Error: Chat not initialized.' }]);
                setIsLoading(false);
                return;
            }
            
            try {
                const responseStream = await chat.sendMessageStream({ message: userMessageText });
                let firstChunk = true;
                
                for await (const chunk of responseStream) {
                     setMessages(prev => {
                        if (firstChunk) {
                            firstChunk = false;
                            return [...prev, { sender: 'bot', text: chunk.text }];
                        } else {
                            const lastMessage = prev[prev.length - 1];
                            const updatedMessages = [...prev.slice(0, -1)];
                            updatedMessages.push({ ...lastMessage, text: lastMessage.text + chunk.text });
                            return updatedMessages;
                        }
                    });
                }
            } catch (e) {
                const errorText = e instanceof Error ? e.message : 'Sorry, something went wrong.';
                setMessages(prev => [...prev, { sender: 'bot', text: `Error: ${errorText}` }]);
            } finally {
                setIsLoading(false);
            }
        }
    }, [input, chat, isLoading, initializationError]);

    const isChatDisabled = isLoading || !!initializationError;

    return (
        <ToolContainer title="AI Answer Bot">
            <div className="h-96 flex flex-col bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-md p-4">
                <div className="flex-grow overflow-y-auto space-y-4 pr-2">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'bot' && <BotIcon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />}
                            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl ${
                                msg.sender === 'user' 
                                ? 'bg-primary text-white' 
                                : 'bg-white text-dark border dark:bg-slate-700 dark:text-light dark:border-slate-600'
                            }`}>
                                <div className="whitespace-pre-wrap">{msg.text}</div>
                                {msg.imageUrl && (
                                    <div className="mt-2">
                                        <img src={msg.imageUrl} alt={msg.text} className="rounded-lg max-w-full h-auto" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex items-start gap-3 justify-start">
                            <BotIcon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                            <div className="max-w-xs md:max-w-md lg:max-w-lg px-2 py-1 rounded-xl bg-white text-dark border dark:bg-slate-700 dark:text-light dark:border-slate-600">
                                <TypingIndicator />
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
                <div className="mt-4 flex">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={initializationError ? "Chat is disabled." : "Ask me anything or generate an image..."}
                        disabled={isChatDisabled}
                        className="flex-grow p-3 border border-r-0 border-gray-300 rounded-l-md focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-slate-900 dark:border-slate-600 dark:text-light disabled:bg-gray-200 dark:disabled:bg-slate-800 disabled:cursor-not-allowed"
                    />
                    <button
                        onClick={handleImagineClick}
                        disabled={isChatDisabled}
                        className="bg-gray-200 dark:bg-slate-700 text-secondary dark:text-slate-300 px-4 py-2 border-t border-b border-gray-300 dark:border-slate-600 hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
                        aria-label="Generate image"
                    >
                        <ImageIcon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleSend}
                        disabled={isChatDisabled || !input.trim()}
                        className="bg-primary text-white font-semibold px-6 py-2 rounded-r-md hover:bg-primary-dark transition-colors disabled:bg-gray-400"
                    >
                        Send
                    </button>
                </div>
            </div>
        </ToolContainer>
    );
};

export default AiChatBot;