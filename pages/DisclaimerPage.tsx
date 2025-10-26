import React from 'react';

const DisclaimerPage: React.FC = () => {
    return (
        <div className="bg-white dark:bg-dark py-12 sm:py-16 transition-colors duration-300 fade-in">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-extrabold text-dark dark:text-light tracking-tight mb-8">Disclaimer</h1>
                    <div className="prose prose-lg dark:prose-invert max-w-none text-secondary dark:text-slate-400 whitespace-pre-wrap">
                        <p>The information provided by this website is for general informational purposes only. All information on the site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability or completeness of any information on the site.</p>
                        <p>Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the site or reliance on any information provided on the site. Your use of the site and your reliance on any information on the site is solely at your own risk.</p>
                        <p>The site may contain links to other websites or content belonging to or originating from third parties or links to websites and features in banners or other advertising. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability or completeness by us.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DisclaimerPage;
