import React from 'react';
import { Link } from 'react-router-dom';
import { TOOLS } from '../constants';
import ToolCard from '../components/ToolCard';
import { SOCIAL_LINKS } from '../constants';

const HomePage: React.FC = () => {
    const featuredTools = TOOLS.filter(tool => tool.isFeatured);

    const HeroSection = () => (
        <section className="bg-white dark:bg-dark py-20 sm:py-24 lg:py-32 transition-colors duration-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-dark dark:text-light tracking-tight">
                    Solve Your Everyday Problems in <span className="text-primary">One Place</span>
                </h1>
                <p className="mt-6 max-w-2xl mx-auto text-lg text-secondary dark:text-slate-400">
                    Access a curated collection of powerful AI tools, converters, and utilities designed to simplify your tasks and boost productivity.
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
            <h2 className="text-3xl font-bold text-dark dark:text-light">About SolverHub</h2>
            <p className="mt-4 text-lg text-secondary dark:text-slate-400">
              SolverHub was created with a simple mission: to provide a single, reliable platform for the essential tools people need every day. From students and writers to developers and business professionals, our goal is to eliminate the hassle of searching for different single-purpose websites. We focus on building high-quality, easy-to-use tools powered by the latest technology to make your life easier and more productive.
            </p>
          </div>
        </div>
      </section>
    );

    const ContactSection = () => (
      <section className="bg-light dark:bg-slate-900 py-16 sm:py-20 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-dark dark:text-light">Get in Touch</h2>
              <p className="mt-2 text-md text-secondary dark:text-slate-400">Have questions, feedback, or a tool suggestion? We'd love to hear from you.</p>
            </div>
            <form className="mt-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input type="text" placeholder="Your Name" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-slate-800 dark:border-slate-600 dark:text-light" />
                <input type="email" placeholder="Your Email" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-slate-800 dark:border-slate-600 dark:text-light" />
              </div>
              <textarea placeholder="Your Message" rows={5} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-slate-800 dark:border-slate-600 dark:text-light"></textarea>
              <div className="text-center">
                <button type="submit" className="bg-primary text-white font-semibold px-8 py-3 rounded-md hover:bg-primary-dark transition-colors duration-300 shadow-lg">
                  Send Message
                </button>
              </div>
            </form>
             <div className="flex justify-center space-x-6 mt-8">
                {Object.entries(SOCIAL_LINKS).map(([name, link]) => (
                    <a key={name} href={link} target="_blank" rel="noopener noreferrer" className="text-secondary dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
                        <span className="capitalize text-lg font-medium">{name}</span>
                    </a>
                ))}
            </div>
          </div>
        </div>
      </section>
    );

    return (
        <div>
            <HeroSection />
            <FeaturedToolsSection />
            <AboutSection />
            <ContactSection />
        </div>
    );
};

export default HomePage;