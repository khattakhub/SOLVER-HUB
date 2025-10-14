import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { db } from '../services/firebase';

interface SocialLinks {
    twitter: string;
    github: string;
    linkedin: string;
}

interface SiteSettings {
    siteName: string;
    primaryColor: string;
    primaryColorDark: string;
    heroTitle: string;
    heroSubtitle: string;
    aboutTitle: string;
    aboutContent: string;
    contactTitle: string;
    contactSubtitle: string;
    socialLinks: SocialLinks;
    privacyPolicy: string;
    termsOfService: string;
}

interface SiteSettingsContextType {
    settings: SiteSettings;
    updateSettings: (newSettings: Partial<SiteSettings>) => void;
}

const SETTINGS_DOC_ID = 'globalSettings';

const defaultSettings: SiteSettings = {
    siteName: 'SolverHub',
    primaryColor: '#0284c7',
    primaryColorDark: '#0369a1',
    heroTitle: 'Solve Your Everyday Problems in <span class="text-primary">One Place</span>',
    heroSubtitle: 'Access a curated collection of powerful AI tools, converters, and utilities designed to simplify your tasks and boost productivity.',
    aboutTitle: 'About SolverHub',
    aboutContent: "SolverHub was created with a simple mission: to provide a single, reliable platform for the essential tools people need every day. From students and writers to developers and business professionals, our goal is to eliminate the hassle of searching for different single-purpose websites. We focus on building high-quality, easy-to-use tools powered by the latest technology to make your life easier and more productive.",
    contactTitle: 'Get in Touch',
    contactSubtitle: "Have questions, feedback, or a tool suggestion? We'd love to hear from you.",
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


const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const SiteSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
    
    useEffect(() => {
        document.documentElement.style.setProperty('--color-primary', settings.primaryColor);
        document.documentElement.style.setProperty('--color-primary-dark', settings.primaryColorDark);
    }, [settings.primaryColor, settings.primaryColorDark]);

    useEffect(() => {
        if (!db) {
            console.warn("Firestore is not available. Using default site settings.");
            return;
        }

        const settingsRef = db.collection('settings').doc(SETTINGS_DOC_ID);

        const unsubscribe = settingsRef.onSnapshot(doc => {
            if (doc.exists) {
                const data = doc.data() as Partial<SiteSettings>;
                 setSettings(prev => ({
                    ...prev,
                    ...data,
                    socialLinks: {
                        ...prev.socialLinks,
                        ...(data.socialLinks || {})
                    }
                }));
            } else {
                // If settings don't exist in Firestore, create them with defaults
                settingsRef.set(defaultSettings).catch(err => {
                    console.error("Error initializing settings in Firestore:", err);
                });
            }
        }, err => {
            console.error("Error fetching site settings:", err);
        });

        return () => unsubscribe();

    }, []);


    const updateSettings = async (newSettings: Partial<SiteSettings>) => {
        if (!db) {
            console.error("Firestore not available. Cannot update settings.");
            return;
        }
        
        try {
            await db.collection('settings').doc(SETTINGS_DOC_ID).update(newSettings);
        } catch (error) {
            console.error("Could not save site settings to Firestore", error);
        }
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