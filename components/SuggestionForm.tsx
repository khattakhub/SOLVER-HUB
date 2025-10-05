import React, { useState } from 'react';
import { db } from '../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const SuggestionForm: React.FC = () => {
    const [toolName, setToolName] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        if (!db) {
            setError('Firebase is not configured. Please check your environment variables.');
            setIsSubmitting(false);
            return;
        }

        try {
            await addDoc(collection(db, 'suggestions'), {
                toolName,
                description,
                timestamp: serverTimestamp(),
            });
            setIsSubmitted(true);
            setToolName('');
            setDescription('');
        } catch (err) {
            setError('Failed to submit the form. Please try again later.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="text-center p-4 bg-green-100 text-green-800 rounded-md">
                <p className="font-semibold">Thank you!</p>
                <p>Your suggestion has been received.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-primary dark:text-white">Suggest a New Tool</h2>
            <div>
                <label htmlFor="toolName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tool Name</label>
                <input
                    type="text"
                    id="toolName"
                    value={toolName}
                    onChange={(e) => setToolName(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={4}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                ></textarea>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
                {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
        </form>
    );
};

export default SuggestionForm;
