import React from 'react';
import Button from './Button';

type Role = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

type RoleSelectorProps = {
  roles: Role[];
  onSelectRole: (roleId: string) => void;
};

export default function RoleSelector({ roles, onSelectRole }: RoleSelectorProps) {
  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Оберіть вашу роль</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div 
            key={role.id}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:border-indigo-500 transition-all cursor-pointer"
            onClick={() => onSelectRole(role.id)}
          >
            <div className="text-4xl mb-4 text-indigo-600">
              {role.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{role.title}</h3>
            <p className="text-gray-600 mb-4">{role.description}</p>
            <Button 
              variant="outline" 
              onClick={() => onSelectRole(role.id)}
              fullWidth
            >
              Обрати
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
} 