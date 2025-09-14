import React, { useState, useMemo } from 'react';
import ToolContainer from './common/ToolContainer';

type Category = 'Length' | 'Weight' | 'Temperature';

const units = {
    Length: { Meter: 1, Kilometer: 1000, Mile: 1609.34, Foot: 0.3048 },
    Weight: { Kilogram: 1, Gram: 0.001, Pound: 0.453592, Ounce: 0.0283495 },
    Temperature: {}, // Special handling
};

const UnitConverter: React.FC = () => {
    const [category, setCategory] = useState<Category>('Length');
    const [fromUnit, setFromUnit] = useState('Meter');
    const [toUnit, setToUnit] = useState('Kilometer');
    const [inputValue, setInputValue] = useState('1');

    const handleCategoryChange = (newCategory: Category) => {
        setCategory(newCategory);
        const newUnits = Object.keys(units[newCategory]);
        if(newCategory === 'Temperature'){
            setFromUnit('Celsius');
            setToUnit('Fahrenheit');
        } else {
            setFromUnit(newUnits[0]);
            setToUnit(newUnits[1] || newUnits[0]);
        }
        setInputValue('1');
    };

    const convertedValue = useMemo(() => {
        const value = parseFloat(inputValue);
        if (isNaN(value)) return '...';

        if (category === 'Temperature') {
            if (fromUnit === 'Celsius' && toUnit === 'Fahrenheit') return (value * 9/5 + 32).toFixed(2);
            if (fromUnit === 'Fahrenheit' && toUnit === 'Celsius') return ((value - 32) * 5/9).toFixed(2);
            if (fromUnit === 'Celsius' && toUnit === 'Kelvin') return (value + 273.15).toFixed(2);
            if (fromUnit === 'Kelvin' && toUnit === 'Celsius') return (value - 273.15).toFixed(2);
            if (fromUnit === 'Fahrenheit' && toUnit === 'Kelvin') return ((value - 32) * 5/9 + 273.15).toFixed(2);
            if (fromUnit === 'Kelvin' && toUnit === 'Fahrenheit') return ((value - 273.15) * 9/5 + 32).toFixed(2);
            return value.toFixed(2);
        }
        
        const fromValueInBase = value * units[category][fromUnit];
        const toValue = fromValueInBase / units[category][toUnit];
        return toValue.toLocaleString();

    }, [inputValue, fromUnit, toUnit, category]);
    
    const categoryUnits = category === 'Temperature' ? ['Celsius', 'Fahrenheit', 'Kelvin'] : Object.keys(units[category]);

    return (
        <ToolContainer title="Convert Units Instantly">
            <div className="flex flex-wrap justify-center gap-2 mb-4">
                {(Object.keys(units) as Category[]).map(cat => (
                    <button key={cat} onClick={() => handleCategoryChange(cat)} className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${category === cat ? 'bg-primary text-white' : 'bg-gray-200 text-secondary hover:bg-gray-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'}`}>
                        {cat}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">From</label>
                    <div className="flex mt-1">
                        <input type="number" value={inputValue} onChange={e => setInputValue(e.target.value)} className="flex-grow p-3 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-slate-800 dark:border-slate-600 dark:text-light" />
                        <select value={fromUnit} onChange={e => setFromUnit(e.target.value)} className="p-3 border-t border-b border-r border-gray-300 rounded-r-md bg-gray-50 focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-slate-700 dark:border-slate-600 dark:text-light">
                            {categoryUnits.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                    </div>
                </div>
                <div className="text-center text-2xl font-bold hidden md:block pb-3 dark:text-light">=</div>
                <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">To</label>
                    <div className="flex mt-1">
                        <div className="flex-grow p-3 bg-sky-50 border border-sky-200 rounded-l-md font-semibold text-dark dark:bg-slate-800 dark:border-slate-700 dark:text-light">{convertedValue}</div>
                        <select value={toUnit} onChange={e => setToUnit(e.target.value)} className="p-3 border-t border-b border-r border-gray-300 rounded-r-md bg-gray-50 focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-slate-700 dark:border-slate-600 dark:text-light">
                             {categoryUnits.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                    </div>
                </div>
            </div>
        </ToolContainer>
    );
};

export default UnitConverter;