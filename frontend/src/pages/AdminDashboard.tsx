import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import type { EmployeeResponse, EmployeeRequest, WeeklyHoursResponse } from '../services/api';
import { FiUsers, FiPlus, FiEdit2, FiTrash2, FiClock, FiLogOut, FiRefreshCw, FiX } from 'react-icons/fi';
import { format } from 'date-fns';

export const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
  const [weeklyHours, setWeeklyHours] = useState<WeeklyHoursResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'employees' | 'hours' | 'history'>('employees');
  const [selectedEmployeeHistory, setSelectedEmployeeHistory] = useState<WeeklyHoursResponse | null>(null);

  const [employeeForm, setEmployeeForm] = useState<EmployeeRequest>({
    name: '',
    username: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState<{
    name?: string;
    username?: string;
    password?: string;
  }>({});

  const loadEmployees = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await apiService.getAllEmployees();
      setEmployees(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load employees');
    } finally {
      setIsLoading(false);
    }
  };

  const loadWeeklyHours = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await apiService.getAllEmployeesWeeklyHours();
      setWeeklyHours(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load weekly hours');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
    loadWeeklyHours();
  }, []);

  const validateForm = () => {
    const errors: { name?: string; username?: string; password?: string } = {};

    if (!employeeForm.name.trim()) {
      errors.name = 'Name is required';
    } else if (employeeForm.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!employeeForm.username.trim()) {
      errors.username = 'Username is required';
    } else if (employeeForm.username.trim().length < 3) {
      errors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(employeeForm.username)) {
      errors.username = 'Username can only contain letters, numbers, and underscores';
    }

    if (!editingEmployee && !employeeForm.password) {
      errors.password = 'Password is required';
    } else if (employeeForm.password && employeeForm.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateEmployee = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    setError('');
    try {
      await apiService.createEmployee(employeeForm);
      setShowEmployeeModal(false);
      resetForm();
      await loadEmployees();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create employee');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateEmployee = async () => {
    if (!editingEmployee) return;
    if (!validateForm()) return;
    setIsLoading(true);
    setError('');

    try {
      // Create a payload object
      const payload: EmployeeRequest = {
        name: employeeForm.name!, 
        username: employeeForm.username!,
        ...(employeeForm.password?.trim() ? { password: employeeForm.password } : {})
      };

      await apiService.updateEmployee(editingEmployee.id, payload);

      setShowEmployeeModal(false);
      setEditingEmployee(null);
      resetForm();
      await loadEmployees();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update employee');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEmployee = async (id: number) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    setIsLoading(true);
    setError('');
    try {
      await apiService.deleteEmployee(id);
      // Update UI instantly after successful delete
      setEmployees(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete employee');
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (employee: EmployeeResponse) => {
    setEditingEmployee(employee);
    setEmployeeForm({
      name: employee.name,
      username: employee.username,
      password: '', 
    });
    setShowEmployeeModal(true);
  };

  const openCreateModal = () => {
    setEditingEmployee(null);
    resetForm();
    setShowEmployeeModal(true);
  };

  const resetForm = () => {
    setEmployeeForm({
      name: '',
      username: '',
      password: '',
    });
    setFormErrors({});
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy h:mm a');
  };

  const formatDuration = (hours: number | null) => {
    if (hours === null) return '0h 0m';
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiLogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between items-start">
            <div className="pr-4">{error}</div>
            <button
              onClick={() => setError('')}
              aria-label="Close error"
              className="text-red-700 hover:text-red-900 ml-4"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('employees')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'employees'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FiUsers className="inline w-5 h-5 mr-2" />
                Employees
              </button>
              <button
                onClick={() => setActiveTab('hours')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'hours'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FiClock className="inline w-5 h-5 mr-2" />
                Weekly Hours
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'history'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FiClock className="inline w-5 h-5 mr-2" />
                Shift History
              </button>
            </nav>
          </div>
        </div>

        {/* Employees Tab */}
        {activeTab === 'employees' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Employees</h2>
              <button
                onClick={openCreateModal}
                className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                <FiPlus className="w-5 h-5" />
                Add Employee
              </button>
            </div>

            {isLoading && employees.length === 0 ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Username
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {employees.map((employee) => (
                      <tr key={employee.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {employee.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {employee.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {employee.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              employee.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {employee.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditModal(employee)}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              <FiEdit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteEmployee(employee.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Weekly Hours Tab */}
        {activeTab === 'hours' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Weekly Hours</h2>
              <button
                onClick={loadWeeklyHours}
                disabled={isLoading}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <FiRefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {isLoading && weeklyHours.length === 0 ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {weeklyHours.map((employeeHours) => (
                  <div
                    key={employeeHours.employeeId}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-medium text-gray-900 mb-2">{employeeHours.employeeName}</h3>
                    <div className="text-2xl font-bold text-primary-600">
                      {formatDuration(employeeHours.totalWeeklyHours)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {employeeHours.shifts.length} shift{employeeHours.shifts.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Shift History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Shift History</h2>
            {selectedEmployeeHistory ? (
              <div>
                <button
                  onClick={() => setSelectedEmployeeHistory(null)}
                  className="mb-4 flex items-center gap-2 text-primary-600 hover:text-primary-700"
                >
                  <FiX className="w-5 h-5" />
                  Back to List
                </button>
                <div className="space-y-3">
                  {selectedEmployeeHistory.shifts.map((shift) => (
                    <div
                      key={shift.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">
                            Clock In: {formatTime(shift.clockIn)}
                          </p>
                          {shift.clockOut && (
                            <p className="text-sm text-gray-600">
                              Clock Out: {formatTime(shift.clockOut)}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {formatDuration(shift.totalHours)}
                          </p>
                          {!shift.clockOut && (
                            <span className="text-xs text-green-600">Active</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {weeklyHours.map((employeeHours) => (
                  <div
                    key={employeeHours.employeeId}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedEmployeeHistory(employeeHours)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-900">{employeeHours.employeeName}</h3>
                        <p className="text-sm text-gray-600">
                          {employeeHours.shifts.length} shift{employeeHours.shifts.length !== 1 ? 's' : ''} this week
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-primary-600">
                          {formatDuration(employeeHours.totalWeeklyHours)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Employee Modal */}
        {showEmployeeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingEmployee ? 'Edit Employee' : 'Add Employee'}
                </h3>
                <button
                  onClick={() => {
                    setShowEmployeeModal(false);
                    setEditingEmployee(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={employeeForm.name}
                    onChange={(e) => {
                      setEmployeeForm({ ...employeeForm, name: e.target.value });
                      if (formErrors.name) {
                        setFormErrors({ ...formErrors, name: undefined });
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      formErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={employeeForm.username}
                    onChange={(e) => {
                      setEmployeeForm({ ...employeeForm, username: e.target.value });
                      if (formErrors.username) {
                        setFormErrors({ ...formErrors, username: undefined });
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      formErrors.username ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {formErrors.username && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password {editingEmployee && '(leave empty to keep current)'}
                  </label>
                  <input
                    type="password"
                    value={employeeForm.password}
                    onChange={(e) => {
                      setEmployeeForm({ ...employeeForm, password: e.target.value });
                      if (formErrors.password) {
                        setFormErrors({ ...formErrors, password: undefined });
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      formErrors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required={!editingEmployee}
                  />
                  {formErrors.password && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowEmployeeModal(false);
                      setEditingEmployee(null);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingEmployee ? handleUpdateEmployee : handleCreateEmployee}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : editingEmployee ? 'Update' : 'Create'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};