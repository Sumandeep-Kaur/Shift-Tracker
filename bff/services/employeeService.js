import springBootClient from '../config/springBootClient.js';

class EmployeeService {
  /**
   * Get all employees
   * @param {string} token - JWT token
   * @returns {Promise<Array>} List of employees
   */
  async getAllEmployees(token) {
    try {
      const response = await springBootClient.get('/api/admin/employees', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create new employee
   * @param {string} token - JWT token
   * @param {Object} employeeData - Employee data
   * @returns {Promise<Object>} Created employee
   */
  async createEmployee(token, employeeData) {
    try {
      const response = await springBootClient.post('/api/admin/employees', employeeData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update employee
   * @param {string} token - JWT token
   * @param {number} id - Employee ID
   * @param {Object} employeeData - Updated employee data
   * @returns {Promise<Object>} Updated employee
   */
  async updateEmployee(token, id, employeeData) {
    try {
      const response = await springBootClient.put(`/api/admin/employees/${id}`, employeeData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete employee
   * @param {string} token - JWT token
   * @param {number} id - Employee ID
   * @returns {Promise<void>}
   */
  async deleteEmployee(token, id) {
    try {
      await springBootClient.delete(`/api/admin/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all employees' weekly hours
   * @param {string} token - JWT token
   * @returns {Promise<Array>} Weekly hours data for all employees
   */
  async getAllEmployeesWeeklyHours(token) {
    try {
      const response = await springBootClient.get('/api/admin/weekly-hours', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new EmployeeService();


