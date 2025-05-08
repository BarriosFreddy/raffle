import React, { useState } from 'react';
import { useThemeStore } from '../store/themeStore';

const PRESET_COLORS = [
  '#4f46e5', // indigo-600 (default)
  '#2563eb', // blue-600
  '#9333ea', // purple-600
  '#e11d48', // rose-600
  '#16a34a', // green-600
  '#ea580c', // orange-600
  '#0891b2', // cyan-600
  '#4338ca', // indigo-700
  '#1e40af', // blue-800
  '#7e22ce'  // purple-700
];

export function ColorPicker() {
  const { primaryColor, setPrimaryColor } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-md border border-gray-300 p-2 shadow-sm hover:shadow-md transition-all"
        title="Cambiar color de tema"
      >
        <div 
          className="w-6 h-6 rounded-full border border-gray-300" 
          style={{ backgroundColor: primaryColor }}
        />
        <span className="text-sm text-gray-600">Tema</span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 z-10 bg-white rounded-lg shadow-lg p-3 border border-gray-200">
          <div className="grid grid-cols-5 gap-2 mb-3">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => {
                  setPrimaryColor(color);
                  setIsOpen(false);
                }}
                className={`w-8 h-8 rounded-full border ${
                  primaryColor === color
                    ? 'border-2 border-gray-800 shadow-md'
                    : 'border-gray-300 hover:border-gray-500'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Color personalizado</label>
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-full h-8 cursor-pointer rounded-md"
            />
          </div>
        </div>
      )}
    </div>
  );
}
