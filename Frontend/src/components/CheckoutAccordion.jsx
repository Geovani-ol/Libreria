import { useState } from "react";

export default function CheckoutAccordion({ number, title, isOpen, onToggle, children }) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
            {/* Header del acordeón */}
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-white font-bold text-sm">
                        {number}
                    </span>
                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                </div>

                <svg
                    className={`w-6 h-6 text-gray-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Contenido del acordeón */}
            <div
                className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="px-6 pb-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
