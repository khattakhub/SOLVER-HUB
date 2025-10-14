import React, { useState, useEffect } from 'react';
import { NAV_LINKS, TOOLS } from '../constants';

const SitemapPage: React.FC = () => {
    const [sitemapContent, setSitemapContent] = useState('Generating...');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const baseUrl = window.location.origin;

        const mainPages = NAV_LINKS.map(link => link.path);
        const legalPages = ['/privacy-policy', '/terms-of-service'];
        const toolPages = TOOLS.map(tool => `/tools/${tool.id}`);

        // Use a Set to ensure unique URLs
        const allUrls = [...new Set([...mainPages, ...legalPages, ...toolPages])];

        const urlset = allUrls.map(url => {
            const fullUrl = `${baseUrl}${url}`;
            const priority = url === '/' ? '1.0' : (url.startsWith('/tools/') ? '0.7' : '0.8');
            return `  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>${priority}</priority>
  </url>`;
        }).join('\n');

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>`;

        setSitemapContent(xml.trim());
    }, []);

    const handleCopy = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(sitemapContent);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="bg-white dark:bg-dark py-12 sm:py-16 transition-colors duration-300 fade-in">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-extrabold text-dark dark:text-light tracking-tight mb-4">Sitemap.xml Generator</h1>
                    <p className="text-lg text-secondary dark:text-slate-400 mb-6">
                        To help search engines like Google crawl your site effectively, you need a <code>sitemap.xml</code> file. Since this is a single-page application, we generate the required content for you here.
                    </p>
                    
                    <div className="bg-sky-50 dark:bg-slate-900 p-6 rounded-lg border dark:border-slate-700">
                        <h2 className="text-2xl font-bold text-dark dark:text-light mb-2">Instructions</h2>
                        <ol className="list-decimal list-inside space-y-2 text-secondary dark:text-slate-400">
                            <li>Click the "Copy to Clipboard" button below.</li>
                            <li>Create a new file in your website's public root directory named <code>sitemap.xml</code>.</li>
                            <li>Paste the copied content into this new file and save it.</li>
                            <li>Deploy your website. You can then submit your sitemap URL (e.g., <code>{`${window.location.origin}/sitemap.xml`}</code>) to search engine consoles.</li>
                        </ol>
                    </div>

                    <div className="mt-8 relative">
                         <button
                            onClick={handleCopy}
                            className="absolute top-4 right-4 bg-primary text-white font-semibold px-4 py-2 rounded-md hover:bg-primary-dark transition-colors text-sm"
                        >
                            {copied ? 'Copied!' : 'Copy to Clipboard'}
                        </button>
                        <pre className="bg-slate-800 text-slate-300 p-4 rounded-md overflow-x-auto h-96">
                            <code className="language-xml">
                                {sitemapContent}
                            </code>
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SitemapPage;