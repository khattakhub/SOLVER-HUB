import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Chat } from '@google/genai';
import { createChat } from '../services/geminiService';
import ToolContainer from './common/ToolContainer';

interface Message {
    sender: 'user' | 'bot';
    text: string;
}

const AiChatBot: React.FC = () => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        try {
            setChat(createChat());
            setMessages([{ sender: 'bot', text: "Hello! I'm the AI Answer Bot. How can I help you today?" }]);
        } catch (e) {
            const errorText = e instanceof Error ? e.message : 'Sorry, something went wrong during initialization.';
            setMessages([{ sender: 'bot', text: `Error: ${errorText}` }]);
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = useCallback(async () => {
        if (!input.trim() || !chat || isLoading) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        
        // Add a placeholder for the bot's response
        setMessages(prev => [...prev, { sender: 'bot', text: '' }]);

        try {
            const responseStream = await chat.sendMessageStream({ message: input });
            
            for await (const chunk of responseStream) {
                 setMessages(prev => {
                    const lastMessage = prev[prev.length - 1];
                    if (lastMessage.sender === 'bot') {
                        const updatedMessages = [...prev.slice(0, -1)];
                        updatedMessages.push({ sender: 'bot', text: lastMessage.text + chunk.text });
                        return updatedMessages;
                    }
                    return prev;
                });
            }
        } catch (e) {
            const errorText = e instanceof Error ? e.message : 'Sorry, something went wrong.';
            setMessages(prev => [...prev.slice(0, -1), { sender: 'bot', text: `Error: ${errorText}` }]);
        } finally {
            setIsLoading(false);
        }
    }, [input, chat, isLoading]);

    return (
        <ToolContainer title="AI Answer Bot">
            <div className="h-96 flex flex-col bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-md p-4">
                <div className="flex-grow overflow-y-auto space-y-4 pr-2">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl ${
                                msg.sender === 'user' 
                                ? 'bg-primary text-white' 
                                : 'bg-white text-dark border dark:bg-slate-700 dark:text-light dark:border-slate-600'
                            } ${!msg.text && isLoading ? 'animate-pulse' : ''}`}>
                                {msg.text || '...'}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="mt-4 flex">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask me anything..."
                        disabled={isLoading || !chat}
                        className="flex-grow p-3 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-slate-900 dark:border-slate-600 dark:text-light"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim() || !chat}
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
