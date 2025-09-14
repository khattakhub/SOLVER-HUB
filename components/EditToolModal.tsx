import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Tool, ToolCategory } from '../types';

interface EditToolModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (tool: Tool) => void;
    tool: Tool | null;
}

const EditToolModal: React.FC<EditToolModalProps> = ({ isOpen, onClose, onSave, tool }) => {
    const [formData, setFormData] = useState<Partial<Tool>>({});

    useEffect(() => {
        if (tool) {
            setFormData(tool);
        }
    }, [tool]);

    if (!tool) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as Tool);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Edit ${tool.name}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Tool Name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name || ''}
                        onChange={handleChange}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-slate-900 dark:border-slate-600 dark:text-light"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Description</label>
                    <textarea
                        name="description"
                        id="description"
                        rows={3}
                        value={formData.description || ''}
                        onChange={handleChange}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-slate-900 dark:border-slate-600 dark:text-light"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Category</label>
                    <select
                        name="category"
                        id="category"
                        value={formData.category || ''}
                        onChange={handleChange}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition dark:bg-slate-900 dark:border-slate-600 dark:text-light"
                        required
                    >
                        {Object.values(ToolCategory).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="isFeatured"
                        id="isFeatured"
                        checked={formData.isFeatured || false}
                        onChange={handleChange}
                        className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary dark:bg-slate-700 dark:border-slate-600"
                    />
                    <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900 dark:text-slate-300">Featured Tool</label>
                </div>
                <div className="flex justify-end space-x-4 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold rounded-md bg-gray-200 text-secondary hover:bg-gray-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-semibold rounded-md bg-primary text-white hover:bg-primary-dark transition-colors"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default EditToolModal;
