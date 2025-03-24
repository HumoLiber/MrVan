import React from 'react';
import { useFormContext } from 'react-hook-form';

type Option = {
  value: string;
  label: string;
};

type FormSelectProps = {
  name: string;
  label: string;
  options: Option[];
  required?: boolean;
};

export default function FormSelect({
  name,
  label,
  options,
  required = false,
}: FormSelectProps) {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={name}
        {...register(name)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">Оберіть варіант</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
} 