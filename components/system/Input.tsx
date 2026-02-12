import React from 'react';

export interface InputProps {
  type?: 'text' | 'email' | 'password';
  placeholder?: string;
  label?: string;
}

export function Input({ type = 'text', placeholder, label }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full mb-4">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        // Strict Tailwind styling. The AI cannot change this!
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      />
    </div>
  );
}