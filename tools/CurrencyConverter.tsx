import React, { useState, useCallback } from 'react';
import { getCurrencyConversion } from '../services/geminiService';
import ToolContainer from './common/ToolContainer';

const popularCurrencies = ['USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD', 'CHF', 'CNY', 'INR'];

const CurrencyConverter: React.FC = () => {
    const [amount, setAmount] = useState('100');
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('EUR');
    const [result, setResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConvert = useCallback(async () => {
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            setError("Please enter a valid amount.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const convertedValue = await getCurrencyConversion(numericAmount, fromCurrency, toCurrency);
            setResult(convertedValue);
        } catch (e) {
            setError(e instanceof Error ? e.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, [amount, fromCurrency, toCurrency]);

    return (
        <ToolContainer title="Convert Currencies">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Amount</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-slate-800 dark:border-slate-600 dark:text-light"
                    />
                </div>
                <div>
                    <label htmlFor="from" className="block text-sm font-medium text-gray-700 dark:text-slate-300">From</label>
                    <select id="from" value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)} className="mt-1 w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-slate-800 dark:border-slate-600 dark:text-light">
                        {popularCurrencies.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="to" className="block text-sm font-medium text-gray-700 dark:text-slate-300">To</label>
                    <select id="to" value={toCurrency} onChange={(e) => setToCurrency(e.target.value)} className="mt-1 w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-slate-800 dark:border-slate-600 dark:text-light">
                        {popularCurrencies.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>
            <button
                onClick={handleConvert}
                disabled={isLoading}
                className="w-full bg-primary text-white font-semibold px-6 py-3 rounded-md hover:bg-primary-dark transition-colors disabled:bg-gray-400"
            >
                {isLoading ? 'Converting...' : 'Convert'}
            </button>
            
            {isLoading && (
                 <div className="w-full p-4 bg-gray-100 dark:bg-slate-800 rounded-md animate-pulse min-h-[50px] flex items-center justify-center">
                    <p className="text-secondary dark:text-slate-400">Fetching latest rates...</p>
                </div>
            )}
            {error && (
                <div className="w-full p-4 bg-red-100 text-red-700 rounded-md border border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700">
                    <p className="whitespace-pre-wrap"><strong>Error:</strong> {error}</p>
                </div>
            )}
            {result && !isLoading && (
                 <div>
                    <h3 className="text-lg font-semibold text-dark dark:text-light mb-2">Converted Amount</h3>
                    <div className="w-full p-4 bg-sky-50 rounded-md border border-sky-200 text-center dark:bg-slate-800 dark:border-slate-700">
                       <span className="text-3xl font-bold text-dark dark:text-light">{result}</span>
                       <span className="text-xl text-secondary dark:text-slate-400 ml-2">{toCurrency}</span>
                    </div>
                </div>
            )}
        </ToolContainer>
    );
};

export default CurrencyConverter;