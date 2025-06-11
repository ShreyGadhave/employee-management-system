import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { Employee, SortConfig } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { validateEmployee, ValidationError } from '../utils/validation';

// Sample data for initial state with Indian Rupee salaries
const sampleEmployees: Employee[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '1234567890',
    position: 'Software Engineer',
    department: 'Engineering',
    hireDate: '2020-01-15',
    salary: 1200000 // ₹12,00,000
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '9876543210',
    position: 'Product Manager',
    department: 'Product',
    hireDate: '2019-05-20',
    salary: 1500000 // ₹15,00,000
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Johnson',
    email: 'michael.j@example.com',
    phone: '5551234567',
    position: 'UX Designer',
    department: 'Design',
    hireDate: '2021-03-10',
    salary: 900000 // ₹9,00,000
  }
];

interface EmployeeContextProps {
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, 'id'>) => ValidationError[] | null;
  updateEmployee: (id: string, employee: Omit<Employee, 'id'>) => ValidationError[] | null;
  deleteEmployee: (id: string) => void;
  getEmployeeById: (id: string) => Employee | undefined;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredEmployees: Employee[];
  sortConfig: SortConfig | null;
  setSortConfig: (config: SortConfig | null) => void;
  selectedDepartment: string;
  setSelectedDepartment: (department: string) => void;
  departments: string[];
}

const EmployeeContext = createContext<EmployeeContextProps | undefined>(undefined);

export const EmployeeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useLocalStorage<Employee[]>('employees', sampleEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  // Get unique departments from employees
  const departments = ['All', ...Array.from(new Set(employees.map(emp => emp.department)))];

  const addEmployee = useCallback((employee: Omit<Employee, 'id'>): ValidationError[] | null => {
    const errors = validateEmployee(employee);
    
    if (errors.length > 0) {
      return errors;
    }
    
    const newEmployee: Employee = {
      ...employee,
      id: Date.now().toString(),
    };
    
    setEmployees(prev => [...prev, newEmployee]);
    return null;
  }, [setEmployees]);

  const updateEmployee = useCallback((id: string, employee: Omit<Employee, 'id'>): ValidationError[] | null => {
    const errors = validateEmployee(employee);
    
    if (errors.length > 0) {
      return errors;
    }
    
    setEmployees(prev => prev.map(emp => emp.id === id ? { ...employee, id } : emp));
    return null;
  }, [setEmployees]);

  const deleteEmployee = useCallback((id: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  }, [setEmployees]);

  const getEmployeeById = useCallback((id: string) => {
    return employees.find(emp => emp.id === id);
  }, [employees]);

  // Filter employees based on search term and selected department
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = (
      emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesDepartment = selectedDepartment === 'All' || emp.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  // Sort filtered employees if sort config is set
  const sortedEmployees = sortConfig 
    ? [...filteredEmployees].sort((a, b) => {
        const aValue = a[sortConfig.field];
        const bValue = b[sortConfig.field];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc' 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
        } else {
          return sortConfig.direction === 'asc'
            ? (aValue < bValue ? -1 : 1)
            : (bValue < aValue ? -1 : 1);
        }
      })
    : filteredEmployees;

  return (
    <EmployeeContext.Provider value={{
      employees,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      getEmployeeById,
      searchTerm,
      setSearchTerm,
      filteredEmployees: sortedEmployees,
      sortConfig,
      setSortConfig,
      selectedDepartment,
      setSelectedDepartment,
      departments
    }}>
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployees = () => {
  const context = useContext(EmployeeContext);
  if (context === undefined) {
    throw new Error('useEmployees must be used within an EmployeeProvider');
  }
  return context;
};