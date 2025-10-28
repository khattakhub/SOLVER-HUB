import React, { useState } from 'react';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';
import { db } from '../../services/firebase';
import { collection, addDoc } from 'firebase/firestore';

const ContactSection: React.FC = () => {
    const { settings } = useSiteSettings();
    const socialLinks = settings.socialLinks;
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessageText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !email.trim() || !message.trim()) {
            setSubmitStatus({ type: 'error', text: 'Please fill out all fields.' });
            return;
        }
        if (!db) {
            setSubmitStatus({ type: 'error', text: 'Database service is not available.' });
            return;
        }
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const newMessage = {
                name,
                email,
                message,
                date: new Date().toISOString(),
            };
            await addDoc(collection(db, 'messages'), newMessage);

            setSubmitStatus({ type: 'success', text: 'Your message has been sent successfully!' });
            setName('');
            setEmail('');
            setMessageText('');
        } catch (error) {
            console.error("Failed to save message:", error);
            setSubmitStatus({ type: 'error', text: 'An error occurred. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="bg-light dark:bg-slate-900 py-16 sm:py-20 transition-colors duration-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-xl mx-auto">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-dark dark:text-light">{settings.contactTitle}</h2>
                        <p className="mt-2 text-md text-secondary dark:text-slate-400">{settings.contactSubtitle}</p>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <input type="text" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-slate-800 dark:border-slate-600 dark:text-light" />
                            <input type="email" placeholder="Your Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-slate-800 dark:border-slate-600 dark:text-light" />
                        </div>
                        <textarea placeholder="Your Message" rows={5} value={message} onChange={e => setMessageText(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-slate-800 dark:border-slate-600 dark:text-light"></textarea>
                        
                        {submitStatus && (
                            <div className={`text-center p-3 rounded-md text-sm ${
                                submitStatus.type === 'success' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' 
                                : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                            }`}>
                                {submitStatus.text}
                            </div>
                        )}

                        <div className="text-center">
                            <button type="submit" disabled={isSubmitting} className="bg-primary text-white font-semibold px-8 py-3 rounded-md hover:bg-primary-dark transition-colors duration-300 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed">
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </div>
                    </form>
                    <div className="flex justify-center space-x-6 mt-8">
                        {Object.entries(socialLinks).filter(([, link]) => link && link.trim() !== '' && link.trim() !== '#').map(([name, link]) => (
                            <a key={name} href={link} target="_blank" rel="noopener noreferrer" className="text-secondary dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
                                <span className="capitalize text-lg font-medium">{name}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
};

export default ContactSection;
