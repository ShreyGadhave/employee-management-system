import React from 'react';
import { Users } from 'lucide-react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users size={28} className="text-white" />
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        <div>
          <p className="text-sm opacity-80">Employee Management System</p>
        </div>
      </div>
    </header>
  );
};

export default Header;