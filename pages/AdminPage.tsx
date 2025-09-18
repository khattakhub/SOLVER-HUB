import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { TOOLS } from '../constants';
import { Tool, Suggestion, ContactMessage } from '../types';
import ConfirmationDialog from '../components/ConfirmationDialog';
import EditToolModal from '../components/EditToolModal';
import { useSiteSettings } from '../contexts/SiteSettingsContext';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-slate-700 flex items-center space-x-4">
        <div className="bg-sky-100 dark:bg-slate-700 p-3 rounded-full">{icon}</div>
        <div>
            <p className="text-sm font-medium text-secondary dark:text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-dark dark:text-light">{value}</p>
        </div>
    </div>
);

type AdminTab = 'dashboard' | 'tools' | 'settings' | 'content' | 'suggestions' | 'inbox';

const AdminPage: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [tools, setTools] = useState<Tool[]>(TOOLS);
    const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
    const { settings, updateSettings } = useSiteSettings();
    const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
    const [siteSettings, setSiteSettings] = useState(settings);
    const [notification, setNotification] = useState('');

    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [suggestionToDelete, setSuggestionToDelete] = useState<Suggestion | null>(null);
    const [isDeleteSuggestionModalOpen, setIsDeleteSuggestionModalOpen] = useState(false);

    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [messageToDelete, setMessageToDelete] = useState<ContactMessage | null>(null);
    const [isDeleteMessageModalOpen, setIsDeleteMessageModalOpen] = useState(false);

    useEffect(() => {
        try {
            const suggestionsRaw = localStorage.getItem('userSuggestions');
            const loadedSuggestions: Suggestion[] = suggestionsRaw ? JSON.parse(suggestionsRaw) : [];
            loadedSuggestions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setSuggestions(loadedSuggestions);
        } catch (error) {
            console.error("Failed to load suggestions:", error);
            showNotification("Error loading suggestions.");
        }

        try {
            const messagesRaw = localStorage.getItem('contactMessages');
            const loadedMessages: ContactMessage[] = messagesRaw ? JSON.parse(messagesRaw) : [];
            loadedMessages.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setMessages(loadedMessages);
        } catch (error) {
            console.error("Failed to load messages:", error);
            showNotification("Error loading messages.");
        }
    }, []);

    const showNotification = (message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(''), 3000);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };
    
    const handleEditClick = (tool: Tool) => {
        setSelectedTool(tool);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (tool: Tool) => {
        setSelectedTool(tool);
        setIsDeleteModalOpen(true);
    };
    
    const handleSaveTool = (updatedTool: Tool) => {
        setTools(prevTools => prevTools.map(t => t.id === updatedTool.id ? updatedTool : t));
        setIsEditModalOpen(false);
        setSelectedTool(null);
        showNotification(`Tool "${updatedTool.name}" updated successfully!`);
    };

    const handleConfirmDelete = () => {
        if (selectedTool) {
            setTools(prevTools => prevTools.filter(t => t.id !== selectedTool.id));
            showNotification(`Tool "${selectedTool.name}" deleted successfully.`);
        }
        setIsDeleteModalOpen(false);
        setSelectedTool(null);
    };

    const handleSaveSettings = (e: React.FormEvent) => {
        e.preventDefault();
        updateSettings(siteSettings);
        showNotification('Site settings updated successfully!');
    };

    const handleSaveContent = (e: React.FormEvent) => {
        e.preventDefault();
        updateSettings(siteSettings);
        showNotification('Content updated successfully!');
    };

    const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        if (Object.keys(siteSettings.socialLinks).includes(name)) {
            setSiteSettings(prev => ({
                ...prev,
                socialLinks: {
                    ...prev.socialLinks,
                    [name]: value
                }
            }));
        } else {
             setSiteSettings(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleDeleteSuggestionClick = (suggestion: Suggestion) => {
        setSuggestionToDelete(suggestion);
        setIsDeleteSuggestionModalOpen(true);
    };

    const handleConfirmDeleteSuggestion = () => {
        if (suggestionToDelete) {
            const updatedSuggestions = suggestions.filter(s => s.id !== suggestionToDelete.id);
            localStorage.setItem('userSuggestions', JSON.stringify(updatedSuggestions));
            setSuggestions(updatedSuggestions);
            showNotification(`Suggestion deleted successfully.`);
        }
        setIsDeleteSuggestionModalOpen(false);
        setSuggestionToDelete(null);
    };
    
    const handleDeleteMessageClick = (message: ContactMessage) => {
        setMessageToDelete(message);
        setIsDeleteMessageModalOpen(true);
    };

    const handleConfirmDeleteMessage = () => {
        if (messageToDelete) {
            const updatedMessages = messages.filter(m => m.id !== messageToDelete.id);
            localStorage.setItem('contactMessages', JSON.stringify(updatedMessages));
            setMessages(updatedMessages);
            showNotification(`Message from ${messageToDelete.name} deleted successfully.`);
        }
        setIsDeleteMessageModalOpen(false);
        setMessageToDelete(null);
    };

    const tabs: { id: AdminTab, name: string }[] = [
        { id: 'dashboard', name: 'Dashboard' },
        { id: 'tools', name: 'Manage Tools' },
        { id: 'inbox', name: 'Inbox' },
        { id: 'suggestions', name: 'User Suggestions' },
        { id: 'settings', name: 'Site Settings' },
        { id: 'content', name: 'Content Management' },
    ];

    return (
        <div className="bg-light dark:bg-slate-900 min-h-full py-12 sm:py-16 transition-colors duration-300 fade-in">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
                    <h1 className="text-4xl font-extrabold text-dark dark:text-light tracking-tight">Admin Dashboard</h1>
                    <button 
                        onClick={handleLogout}
                        className="bg-red-600 text-white font-semibold px-5 py-2 rounded-md hover:bg-red-700 transition-colors self-start sm:self-center"
                    >
                        Logout
                    </button>
                </div>
                
                <div className="border-b border-gray-200 dark:border-slate-700 mb-8">
                    <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center ${
                                    activeTab === tab.id
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-secondary hover:text-dark dark:text-slate-400 dark:hover:text-light hover:border-gray-300 dark:hover:border-slate-600'
                                }`}
                            >
                                {tab.name}
                                {tab.id === 'suggestions' && suggestions.length > 0 && (
                                    <span className="ml-2 bg-primary text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">{suggestions.length}</span>
                                )}
                                {tab.id === 'inbox' && messages.length > 0 && (
                                    <span className="ml-2 bg-primary text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">{messages.length}</span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="fade-in">
                    {activeTab === 'dashboard' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                           <StatCard title="Total Tools" value={tools.length} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary"><path d="M12.22 2h-4.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.44.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.44.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h4.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.44-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.44-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>} />
                           <StatCard title="Inbox Messages" value={messages.length} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>} />
                           <StatCard title="User Suggestions" value={suggestions.length} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/></svg>} />
                           <StatCard title="Page Views" value="N/A" icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>} />
                        </div>
                    )}
                    {activeTab === 'tools' && (
                        <div className="bg-white dark:bg-dark p-6 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="border-b dark:border-slate-700">
                                        <tr>
                                            <th className="p-4 text-sm font-semibold text-secondary dark:text-slate-400">Tool Name</th>
                                            <th className="p-4 text-sm font-semibold text-secondary dark:text-slate-400">Category</th>
                                            <th className="p-4 text-sm font-semibold text-secondary dark:text-slate-400">Featured</th>
                                            <th className="p-4 text-sm font-semibold text-secondary dark:text-slate-400">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tools.map((tool: Tool) => (
                                            <tr key={tool.id} className="border-b dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                                                <td className="p-4 font-medium text-dark dark:text-light">{tool.name}</td>
                                                <td className="p-4 text-secondary dark:text-slate-400">{tool.category}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${tool.isFeatured ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-slate-300'}`}>
                                                        {tool.isFeatured ? 'Yes' : 'No'}
                                                    </span>
                                                </td>
                                                <td className="p-4 space-x-2">
                                                    <button onClick={() => handleEditClick(tool)} className="text-primary hover:underline text-sm font-semibold">Edit</button>
                                                    <button onClick={() => handleDeleteClick(tool)} className="text-red-500 hover:underline text-sm font-semibold">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                             <div className="mt-6 text-right">
                                 <button className="bg-primary text-white font-semibold px-5 py-2 rounded-md hover:bg-primary-dark transition-colors">
                                    Add New Tool
                                </button>
                            </div>
                        </div>
                    )}
                    {activeTab === 'inbox' && (
                        <div className="space-y-6">
                            {messages.length > 0 ? (
                                messages.map(message => (
                                    <div key={message.id} className="bg-white dark:bg-dark p-6 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-bold text-dark dark:text-light">{message.name} <span className="text-sm font-normal text-gray-500 dark:text-slate-400">&lt;{message.email}&gt;</span></h3>
                                                <p className="text-sm text-gray-500 dark:text-slate-500 mt-1">
                                                    Received on: {new Date(message.date).toLocaleString()}
                                                </p>
                                            </div>
                                            <button onClick={() => handleDeleteMessageClick(message)} className="text-red-500 hover:text-red-700 font-semibold text-sm">Delete</button>
                                        </div>
                                        <p className="mt-4 text-secondary dark:text-slate-400 whitespace-pre-wrap">{message.message}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-white dark:bg-dark rounded-xl shadow-lg border border-gray-200 dark:border-slate-700">
                                    <h3 className="text-xl font-semibold text-dark dark:text-light">Your Inbox is Empty</h3>
                                    <p className="mt-2 text-secondary dark:text-slate-400">When users send messages via the contact form, they will appear here.</p>
                                </div>
                            )}
                        </div>
                    )}
                    {activeTab === 'suggestions' && (
                        <div className="space-y-6">
                            {suggestions.length > 0 ? (
                                suggestions.map(suggestion => (
                                    <div key={suggestion.id} className="bg-white dark:bg-dark p-6 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-bold text-dark dark:text-light">{suggestion.idea}</h3>
                                                <p className="text-sm text-gray-500 dark:text-slate-500 mt-1">
                                                    Submitted on: {new Date(suggestion.date).toLocaleString()}
                                                </p>
                                            </div>
                                            <button onClick={() => handleDeleteSuggestionClick(suggestion)} className="text-red-500 hover:text-red-700 font-semibold text-sm">Delete</button>
                                        </div>
                                        <p className="mt-4 text-secondary dark:text-slate-400 whitespace-pre-wrap">{suggestion.description}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-white dark:bg-dark rounded-xl shadow-lg border border-gray-200 dark:border-slate-700">
                                    <h3 className="text-xl font-semibold text-dark dark:text-light">No Suggestions Yet</h3>
                                    <p className="mt-2 text-secondary dark:text-slate-400">When users submit new tool ideas, they will appear here.</p>
                                </div>
                            )}
                        </div>
                    )}
                    {activeTab === 'settings' && (
                        <div className="bg-white dark:bg-dark p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 max-w-3xl mx-auto">
                            <form onSubmit={handleSaveSettings} className="space-y-8">
                                <fieldset>
                                    <legend className="text-2xl font-bold text-dark dark:text-light mb-4">General Settings</legend>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Site Name</label>
                                            <input type="text" name="siteName" id="siteName" value={siteSettings.siteName} onChange={handleSettingsChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-slate-900 dark:border-slate-600 dark:text-light" />
                                        </div>
                                    </div>
                                </fieldset>

                                <fieldset>
                                    <legend className="text-2xl font-bold text-dark dark:text-light mb-4">Appearance</legend>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Primary Color</label>
                                            <div className="mt-1 flex items-center gap-2">
                                                <input type="color" name="primaryColor" id="primaryColor" value={siteSettings.primaryColor} onChange={handleSettingsChange} className="h-10 w-10 p-1 border-gray-300 rounded-md" />
                                                <input type="text" value={siteSettings.primaryColor} onChange={handleSettingsChange} name="primaryColor" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-slate-900 dark:border-slate-600 dark:text-light" />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="primaryColorDark" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Primary Darker Color (for hover)</label>
                                            <div className="mt-1 flex items-center gap-2">
                                                <input type="color" name="primaryColorDark" id="primaryColorDark" value={siteSettings.primaryColorDark} onChange={handleSettingsChange} className="h-10 w-10 p-1 border-gray-300 rounded-md" />
                                                <input type="text" value={siteSettings.primaryColorDark} onChange={handleSettingsChange} name="primaryColorDark" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-slate-900 dark:border-slate-600 dark:text-light" />
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>

                                <fieldset>
                                    <legend className="text-2xl font-bold text-dark dark:text-light mb-4">Social Media Links</legend>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Twitter URL</label>
                                            <input type="text" name="twitter" id="twitter" value={siteSettings.socialLinks.twitter} onChange={handleSettingsChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-slate-900 dark:border-slate-600 dark:text-light" />
                                        </div>
                                        <div>
                                            <label htmlFor="github" className="block text-sm font-medium text-gray-700 dark:text-slate-300">GitHub URL</label>
                                            <input type="text" name="github" id="github" value={siteSettings.socialLinks.github} onChange={handleSettingsChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-slate-900 dark:border-slate-600 dark:text-light" />
                                        </div>
                                        <div>
                                            <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 dark:text-slate-300">LinkedIn URL</label>
                                            <input type="text" name="linkedin" id="linkedin" value={siteSettings.socialLinks.linkedin} onChange={handleSettingsChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-slate-900 dark:border-slate-600 dark:text-light" />
                                        </div>
                                    </div>
                                </fieldset>
                                <div className="text-right pt-4 border-t dark:border-slate-700">
                                    <button type="submit" className="bg-primary text-white font-semibold px-6 py-2 rounded-md hover:bg-primary-dark transition-colors">Save Settings</button>
                                </div>
                            </form>
                        </div>
                    )}
                    {activeTab === 'content' && (
                        <div className="bg-white dark:bg-dark p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700">
                             <form onSubmit={handleSaveContent} className="space-y-8">
                                <fieldset>
                                    <legend className="text-2xl font-bold text-dark dark:text-light mb-4">Homepage Content</legend>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="heroTitle" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Hero Title</label>
                                            <input type="text" name="heroTitle" id="heroTitle" value={siteSettings.heroTitle} onChange={handleSettingsChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-slate-900 dark:border-slate-600 dark:text-light" />
                                            <p className="text-xs text-gray-500 mt-1">HTML is allowed for custom styling, e.g., using &lt;span&gt; tags.</p>
                                        </div>
                                         <div>
                                            <label htmlFor="heroSubtitle" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Hero Subtitle</label>
                                            <textarea name="heroSubtitle" id="heroSubtitle" rows={2} value={siteSettings.heroSubtitle} onChange={handleSettingsChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-slate-900 dark:border-slate-600 dark:text-light" />
                                        </div>
                                         <div>
                                            <label htmlFor="aboutTitle" className="block text-sm font-medium text-gray-700 dark:text-slate-300">About Section Title</label>
                                            <input type="text" name="aboutTitle" id="aboutTitle" value={siteSettings.aboutTitle} onChange={handleSettingsChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-slate-900 dark:border-slate-600 dark:text-light" />
                                        </div>
                                        <div>
                                            <label htmlFor="aboutContent" className="block text-sm font-medium text-gray-700 dark:text-slate-300">About Section Content</label>
                                            <textarea name="aboutContent" id="aboutContent" rows={5} value={siteSettings.aboutContent} onChange={handleSettingsChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-slate-900 dark:border-slate-600 dark:text-light" />
                                        </div>
                                    </div>
                                </fieldset>

                                <fieldset>
                                    <legend className="text-2xl font-bold text-dark dark:text-light mb-4">Legal Pages</legend>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="privacyPolicy" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Privacy Policy</label>
                                            <textarea name="privacyPolicy" id="privacyPolicy" rows={10} value={siteSettings.privacyPolicy} onChange={handleSettingsChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-slate-900 dark:border-slate-600 dark:text-light font-mono text-sm" />
                                        </div>
                                        <div>
                                            <label htmlFor="termsOfService" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Terms of Service</label>
                                            <textarea name="termsOfService" id="termsOfService" rows={10} value={siteSettings.termsOfService} onChange={handleSettingsChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-slate-900 dark:border-slate-600 dark:text-light font-mono text-sm" />
                                        </div>
                                    </div>
                                </fieldset>
                                <div className="text-right pt-4 border-t dark:border-slate-700">
                                    <button type="submit" className="bg-primary text-white font-semibold px-6 py-2 rounded-md hover:bg-primary-dark transition-colors">Save Content</button>
                                </div>
                             </form>
                        </div>
                    )}
                </div>
            </div>
            
            {notification && (
                <div className="fixed bottom-5 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg fade-in">
                    {notification}
                </div>
            )}

            <EditToolModal 
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveTool}
                tool={selectedTool}
            />

            <ConfirmationDialog
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Tool"
                message={`Are you sure you want to delete the "${selectedTool?.name}" tool? This action cannot be undone.`}
            />

            <ConfirmationDialog
                isOpen={isDeleteSuggestionModalOpen}
                onClose={() => setIsDeleteSuggestionModalOpen(false)}
                onConfirm={handleConfirmDeleteSuggestion}
                title="Delete Suggestion"
                message={`Are you sure you want to delete the suggestion "${suggestionToDelete?.idea}"? This action cannot be undone.`}
            />
            
            <ConfirmationDialog
                isOpen={isDeleteMessageModalOpen}
                onClose={() => setIsDeleteMessageModalOpen(false)}
                onConfirm={handleConfirmDeleteMessage}
                title="Delete Message"
                message={`Are you sure you want to delete this message from "${messageToDelete?.name}"? This action cannot be undone.`}
            />
        </div>
    );
};

export default AdminPage;
