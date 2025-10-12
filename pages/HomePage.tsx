import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TOOLS } from '../constants';
import ToolCard from '../components/ToolCard';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { db } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';

const HomePage: React.FC = () => {
    const featuredTools = TOOLS.filter(tool => tool.isFeatured);
    const { settings } = useSiteSettings();
    const socialLinks = settings.socialLinks;


    const HeroSection = () => (
        <section className="bg-white dark:bg-dark py-20 sm:py-24 lg:py-32 transition-colors duration-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 
                    className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-dark dark:text-light tracking-tight"
                    dangerouslySetInnerHTML={{ __html: settings.heroTitle }}
                >
                </h1>
                <p className="mt-6 max-w-2xl mx-auto text-lg text-secondary dark:text-slate-400">
                    {settings.heroSubtitle}
                </p>
                <div className="mt-10 flex justify-center space-x-4">
                    <Link to="/tools" className="bg-primary text-white font-semibold px-8 py-3 rounded-md hover:bg-primary-dark transition-colors duration-300 shadow-lg">
                        Explore All Tools
                    </Link>
                    <Link to="/future" className="bg-gray-200 text-secondary font-semibold px-8 py-3 rounded-md hover:bg-gray-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors duration-300">
                        Upcoming Features
                    </Link>
                </div>
            </div>
        </section>
    );

    const FeaturedToolsSection = () => (
        <section className="py-16 sm:py-20 bg-sky-50 dark:bg-slate-900 transition-colors duration-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-dark dark:text-light">Featured Tools</h2>
                    <p className="mt-2 text-md text-secondary dark:text-slate-400">Our most popular tools to get you started.</p>
                </div>
                <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {featuredTools.map(tool => <ToolCard key={tool.id} tool={tool} />)}
                </div>
            </div>
        </section>
    );
    
    const AboutSection = () => (
      <section className="bg-white dark:bg-dark py-16 sm:py-20 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-dark dark:text-light">{settings.aboutTitle}</h2>
            <p className="mt-4 text-lg text-secondary dark:text-slate-400 whitespace-pre-wrap">
              {settings.aboutContent}
            </p>
          </div>
        </div>
      </section>
    );

    const ContactSection = () => {
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

    return (
        <div className="fade-in">
            <HeroSection />
            <FeaturedToolsSection />
            <AboutSection />
            <ContactSection />
        </div>
    );
};

export default HomePage;