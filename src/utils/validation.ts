export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(phone);
};

export const validateRequired = (value: string): boolean => {
  return value.trim() !== '';
};

export const validateSalary = (salary: number): boolean => {
  return !isNaN(salary) && salary > 0;
};

export interface ValidationError {
  field: string;
  message: string;
}

export const validateEmployee = (employee: any): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!validateRequired(employee.firstName)) {
    errors.push({ field: 'firstName', message: 'First name is required' });
  }

  if (!validateRequired(employee.lastName)) {
    errors.push({ field: 'lastName', message: 'Last name is required' });
  }

  if (!validateRequired(employee.email)) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!validateEmail(employee.email)) {
    errors.push({ field: 'email', message: 'Email is invalid' });
  }

  if (!validateRequired(employee.phone)) {
    errors.push({ field: 'phone', message: 'Phone is required' });
  } else if (!validatePhone(employee.phone)) {
    errors.push({ field: 'phone', message: 'Phone format is invalid' });
  }

  if (!validateRequired(employee.position)) {
    errors.push({ field: 'position', message: 'Position is required' });
  }

  if (!validateRequired(employee.department)) {
    errors.push({ field: 'department', message: 'Department is required' });
  }

  if (!validateRequired(employee.hireDate)) {
    errors.push({ field: 'hireDate', message: 'Hire date is required' });
  }

  if (!validateSalary(employee.salary)) {
    errors.push({ field: 'salary', message: 'Salary must be a positive number' });
  }

  return errors;
};