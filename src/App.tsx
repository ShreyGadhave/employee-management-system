import React from 'react';
import Header from './components/Layout/Header';
import EmployeeList from './components/Employees/EmployeeList';
import { EmployeeProvider } from './contexts/EmployeeContext';

// Add global styles for animations
import './index.css';

function App() {
  return (
    <EmployeeProvider>
      <div className="min-h-screen bg-gray-100">
        <Header title="Staff Directory" />
        <main className="container mx-auto px-4 py-8">
          <EmployeeList />
        </main>
        <footer className="py-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Employee Management System</p>
        </footer>
      </div>
    </EmployeeProvider>
  );
}

export default App;