import React, { useState, useEffect } from 'react';
import { useSiteSettings } from '../contexts/SiteSettingsContext';

const AdminPage: React.FC = () => {
    const { settings, updateSettings } = useSiteSettings();
    const [localSettings, setLocalSettings] = useState(settings);
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setLocalSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLocalSettings(prev => ({
            ...prev,
            socialLinks: { ...prev.socialLinks, [name]: value },
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateSettings(localSettings);
        setStatusMessage('Settings saved successfully!');
        setTimeout(() => setStatusMessage(''), 3000);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* General Settings */}
                <div className="p-6 bg-white rounded-lg shadow">
                    <h2 className="text-2xl font-semibold mb-4">General Settings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">Site Name</label>
                            <input
                                type="text"
                                id="siteName"
                                name="siteName"
                                value={localSettings.siteName}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                            />
                        </div>
                        <div>
                            <label htmlFor="geminiApiKey" className="block text-sm font-medium text-gray-700">Gemini API Key</label>
                            <input
                                type="password" 
                                id="geminiApiKey"
                                name="geminiApiKey"
                                value={localSettings.geminiApiKey}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                                placeholder="Enter your Gemini API key"
                            />
                            <p className="text-xs text-gray-500 mt-1">This key is required for all AI-powered tools to function.</p>
                        </div>
                    </div>
                </div>

                {/* Hero Section */}
                <div className="p-6 bg-white rounded-lg shadow">
                    <h2 className="text-2xl font-semibold mb-4">Hero Section</h2>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="heroTitle" className="block text-sm font-medium text-gray-700">Hero Title</label>
                            <textarea
                                id="heroTitle"
                                name="heroTitle"
                                rows={2}
                                value={localSettings.heroTitle}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                            />
                        </div>
                        <div>
                            <label htmlFor="heroSubtitle" className="block text-sm font-medium text-gray-700">Hero Subtitle</label>
                            <textarea
                                id="heroSubtitle"
                                name="heroSubtitle"
                                rows={3}
                                value={localSettings.heroSubtitle}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                            />
                        </div>
                    </div>
                </div>

                {/* About Section */}
                <div className="p-6 bg-white rounded-lg shadow">
                    <h2 className="text-2xl font-semibold mb-4">About Section</h2>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="aboutTitle" className="block text-sm font-medium text-gray-700">About Title</label>
                            <input
                                type="text"
                                id="aboutTitle"
                                name="aboutTitle"
                                value={localSettings.aboutTitle}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                            />
                        </div>
                        <div>
                            <label htmlFor="aboutContent" className="block text-sm font-medium text-gray-700">About Content</label>
                            <textarea
                                id="aboutContent"
                                name="aboutContent"
                                rows={6}
                                value={localSettings.aboutContent}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                            />
                        </div>
                    </div>
                </div>

                {/* Social Links */}
                <div className="p-6 bg-white rounded-lg shadow">
                    <h2 className="text-2xl font-semibold mb-4">Social Links</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">Twitter URL</label>
                            <input
                                type="text"
                                id="twitter"
                                name="twitter"
                                value={localSettings.socialLinks.twitter}
                                onChange={handleSocialChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                            />
                        </div>
                        <div>
                            <label htmlFor="github" className="block text-sm font-medium text-gray-700">GitHub URL</label>
                            <input
                                type="text"
                                id="github"
                                name="github"
                                value={localSettings.socialLinks.github}
                                onChange={handleSocialChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                            />
                        </div>
                        <div>
                            <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
                            <input
                                type="text"
                                id="linkedin"
                                name="linkedin"
                                value={localSettings.socialLinks.linkedin}
                                onChange={handleSocialChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end items-center">
                    {statusMessage && <p className="text-green-600 mr-4">{statusMessage}</p>}
                    <button
                        type="submit"
                        className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline-blue"
                    >
                        Save Settings
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminPage;
