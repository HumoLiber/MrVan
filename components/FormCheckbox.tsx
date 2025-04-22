import React from 'react';

type FormCheckboxProps = {
  id: string;
  name: string;
  label: React.ReactNode;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
};

export default function FormCheckbox({
  id,
  name,
  label,
  checked,
  onChange,
  required = false,
}: FormCheckboxProps) {
  return (
    <div className="mb-4">
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id={id}
            name={name}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            required={required}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor={id} className="font-medium text-gray-700 cursor-pointer">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        </div>
      </div>
    </div>
  );
}
