import React from 'react';

const ContactUsPage: React.FC = () => {
    return (
        <div className="bg-white dark:bg-dark py-12 sm:py-16 transition-colors duration-300 fade-in">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-extrabold text-dark dark:text-light tracking-tight mb-8">Contact Us</h1>
                    <div className="prose prose-lg dark:prose-invert max-w-none text-secondary dark:text-slate-400 whitespace-pre-wrap">
                        <p>If you have any questions or comments, please don't hesitate to contact us. We would love to hear from you!</p>
                        <p>You can reach us by email at <a href="mailto:support@example.com">support@example.com</a>.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUsPage;
