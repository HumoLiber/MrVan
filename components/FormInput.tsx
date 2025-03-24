import React from 'react';
import { useFormContext } from 'react-hook-form';

type FormInputProps = {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
};

export default function FormInput({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
}: FormInputProps) {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      />
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
} 