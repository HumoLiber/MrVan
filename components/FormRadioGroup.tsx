import React from 'react';

type Option = {
  value: string;
  label: string;
  description: string;
};

type FormRadioGroupProps = {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  options: Option[];
  required?: boolean;
};

export default function FormRadioGroup({
  id,
  name,
  label,
  value,
  onChange,
  options,
  required = false,
}: FormRadioGroupProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="space-y-4">
        {options.map((option) => (
          <div 
            key={option.value} 
            className={`relative border rounded-lg p-4 ${
              value === option.value 
                ? 'border-indigo-500 bg-indigo-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <label className="flex items-start cursor-pointer">
              <div className="flex items-center h-5">
                <input
                  id={`${id}-${option.value}`}
                  name={name}
                  type="radio"
                  value={option.value}
                  checked={value === option.value}
                  onChange={onChange}
                  required={required && options.findIndex(opt => opt.value === value) === -1}
                  className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <span className="font-medium text-gray-900">{option.label}</span>
                <p className="text-gray-500 mt-1">{option.description}</p>
              </div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
