import React, { useState } from 'react';
import { Edit2, Trash2, ChevronUp, ChevronDown, UserPlus } from 'lucide-react';
import { useEmployees } from '../../contexts/EmployeeContext';
import { Employee, SortField } from '../../types';
import Button from '../UI/Button';
import Modal from '../UI/Modal';
import Confirmation from '../UI/Confirmation';
import EmployeeForm from './EmployeeForm';
import EmployeeSearch from './EmployeeSearch';
import Notification from '../UI/Notification';

const EmployeeList: React.FC = () => {
  const { 
    filteredEmployees, 
    addEmployee, 
    updateEmployee, 
    deleteEmployee,
    getEmployeeById,
    sortConfig,
    setSortConfig
  } = useEmployees();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  
  // Handler for sorting columns
  const handleSort = (field: SortField) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.field === field) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }
    
    setSortConfig({ field, direction });
  };
  
  // Get sort icon for column
  const getSortIcon = (field: SortField) => {
    if (!sortConfig || sortConfig.field !== field) {
      return null;
    }
    
    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };
  
  // Handle adding new employee
  const handleAddEmployee = (employeeData: Omit<Employee, 'id'>) => {
    const errors = addEmployee(employeeData);
    
    if (!errors) {
      setIsAddModalOpen(false);
      setNotification({
        message: 'Employee added successfully',
        type: 'success'
      });
      return null;
    }
    
    return errors;
  };
  
  // Handle updating employee
  const handleUpdateEmployee = (employeeData: Omit<Employee, 'id'>) => {
    if (!selectedEmployeeId) return null;
    
    const errors = updateEmployee(selectedEmployeeId, employeeData);
    
    if (!errors) {
      setIsEditModalOpen(false);
      setNotification({
        message: 'Employee updated successfully',
        type: 'success'
      });
      return null;
    }
    
    return errors;
  };
  
  // Handler for edit button
  const handleEditClick = (id: string) => {
    setSelectedEmployeeId(id);
    setIsEditModalOpen(true);
  };
  
  // Handler for delete button
  const handleDeleteClick = (id: string) => {
    setSelectedEmployeeId(id);
    setIsDeleteModalOpen(true);
  };
  
  // Handler for confirming deletion
  const handleDeleteConfirm = () => {
    if (selectedEmployeeId) {
      deleteEmployee(selectedEmployeeId);
      setNotification({
        message: 'Employee deleted successfully',
        type: 'success'
      });
    }
  };
  
  // Get selected employee for editing
  const selectedEmployee = selectedEmployeeId 
    ? getEmployeeById(selectedEmployeeId)
    : undefined;
  
  // Format salary for display in Indian Rupees
  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(salary);
  };
  
  return (
    <div className="mt-8">
      {/* Notification component */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Employees</h2>
        <Button 
          variant="primary" 
          icon={<UserPlus size={18} />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Employee
        </Button>
      </div>
      
      <EmployeeSearch />
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('firstName')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Name</span>
                    {getSortIcon('firstName')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Email</span>
                    {getSortIcon('email')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('position')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Position</span>
                    {getSortIcon('position')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('department')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Department</span>
                    {getSortIcon('department')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('salary')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Salary</span>
                    {getSortIcon('salary')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {employee.firstName} {employee.lastName}
                      </div>
                      <div className="text-xs text-gray-500">{employee.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.position}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {employee.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatSalary(employee.salary)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          icon={<Edit2 size={16} />}
                          onClick={() => handleEditClick(employee.id)}
                          aria-label="Edit"
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm"
                          icon={<Trash2 size={16} />}
                          onClick={() => handleDeleteClick(employee.id)}
                          aria-label="Delete"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    No employees found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Add Employee Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Employee"
        maxWidth="lg"
      >
        <EmployeeForm
          onSubmit={handleAddEmployee}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>
      
      {/* Edit Employee Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Employee"
        maxWidth="lg"
      >
        {selectedEmployee && (
          <EmployeeForm
            initialData={{
              firstName: selectedEmployee.firstName,
              lastName: selectedEmployee.lastName,
              email: selectedEmployee.email,
              phone: selectedEmployee.phone,
              position: selectedEmployee.position,
              department: selectedEmployee.department,
              hireDate: selectedEmployee.hireDate,
              salary: selectedEmployee.salary
            }}
            onSubmit={handleUpdateEmployee}
            onCancel={() => setIsEditModalOpen(false)}
          />
        )}
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Confirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Employee"
        message="Are you sure you want to delete this employee? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default EmployeeList;