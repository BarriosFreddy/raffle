

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

interface ColorPickerInputProps {
  value: string;
  onChange: (color: string) => void;
  error?: string;
}

export function ColorPickerInput({ value, onChange, error }: ColorPickerInputProps) {
  return (
    <div>
      <label htmlFor="themeColor" className="block text-sm font-medium text-gray-700">
        Color del Tema
      </label>
      <div className="mt-2">
        <div className="flex flex-wrap gap-2 mb-3">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onChange(color)}
              className={`w-8 h-8 rounded-full border ${
                value === color
                  ? 'border-2 border-gray-800 shadow-md'
                  : 'border-gray-300'
              }`}
              style={{ backgroundColor: color }}
              aria-label={`Color ${color}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-3">
          <input
            type="color"
            id="themeColor"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-10 w-24 cursor-pointer rounded p-0 border-0"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => {
              const newValue = e.target.value;
              // Only update if it's a valid hex color or empty
              if (newValue === '' || /^#([0-9A-F]{3}){1,2}$/i.test(newValue)) {
                onChange(newValue);
              }
            }}
            className={`block w-32 px-2 py-2 rounded-lg border ${
              error ? "border-red-500" : "border-gray-300"
            } shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            placeholder="#4f46e5"
          />
          <div 
            className="w-10 h-10 rounded-full border border-gray-300" 
            style={{ backgroundColor: value }}
          />
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
