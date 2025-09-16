import React, { createContext, useState, useContext, ReactNode } from 'react';

interface SocialLinks {
    twitter: string;
    github: string;
    linkedin: string;
}

interface SiteSettings {
    socialLinks: SocialLinks;
    privacyPolicy: string;
    termsOfService: string;
}

interface SiteSettingsContextType {
    settings: SiteSettings;
    updateSettings: (newSettings: Partial<SiteSettings>) => void;
}

const SETTINGS_STORAGE_KEY = 'siteSettings';

const defaultSettings: SiteSettings = {
    socialLinks: {
        twitter: 'https://twitter.com',
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
    },
    privacyPolicy: `
Your privacy is important to us. It is SolverHub's policy to respect your privacy regarding any information we may collect from you across our website.

We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.

We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.

We don’t share any personally identifying information publicly or with third-parties, except when required to by law.

Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.

You are free to refuse our request for your personal information, with the understanding that we may be unable to provide you with some of your desired services.

Your continued use of our website will be regarded as acceptance of our practices around privacy and personal information. If you have any questions about how we handle user data and personal information, feel free to contact us.

This policy is effective as of 1 August 2024.
    `.trim(),
    termsOfService: `
By accessing the website at SolverHub, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.

Permission is granted to temporarily download one copy of the materials (information or software) on SolverHub's website for personal, non-commercial transitory viewing only.

The materials on SolverHub's website are provided on an 'as is' basis. SolverHub makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.

In no event shall SolverHub or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on SolverHub's website.

The materials appearing on SolverHub's website could include technical, typographical, or photographic errors. SolverHub does not warrant that any of the materials on its website are accurate, complete or current.

SolverHub has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by SolverHub of the site. Use of any such linked website is at the user's own risk.

SolverHub may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
    `.trim(),
};


const loadSettings = (): SiteSettings => {
    try {
        const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (savedSettings) {
            return JSON.parse(savedSettings);
        }
    } catch (error) {
        console.error("Failed to parse site settings from localStorage", error);
    }
    // If nothing is saved or parsing fails, save the default settings
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(defaultSettings));
    return defaultSettings;
};

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const SiteSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<SiteSettings>(loadSettings);

    const updateSettings = (newSettings: Partial<SiteSettings>) => {
        setSettings(prevSettings => {
            const updated = { 
                ...prevSettings, 
                ...newSettings,
                socialLinks: {
                    ...prevSettings.socialLinks,
                    ...newSettings.socialLinks
                }
            };
            localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    };
    
    return (
        <SiteSettingsContext.Provider value={{ settings, updateSettings }}>
            {children}
        </SiteSettingsContext.Provider>
    );
};

export const useSiteSettings = (): SiteSettingsContextType => {
    const context = useContext(SiteSettingsContext);
    if (!context) {
        throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
    }
    return context;
};
