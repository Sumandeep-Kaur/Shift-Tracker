import springBootClient from '../config/springBootClient.js';

class ShiftService {
  /**
   * Clock in
   * @param {string} token - JWT token
   * @returns {Promise<Object>} Shift data
   */
  async clockIn(token) {
    try {
      const response = await springBootClient.post('/api/shifts/clock-in', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Clock out
   * @param {string} token - JWT token
   * @returns {Promise<Object>} Shift data
   */
  async clockOut(token) {
    try {
      const response = await springBootClient.post('/api/shifts/clock-out', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get active shift
   * @param {string} token - JWT token
   * @returns {Promise<Object|null>} Active shift or null
   */
  async getActiveShift(token) {
    try {
      const response = await springBootClient.get('/api/shifts/active', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      if (error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Get weekly hours for current user
   * @param {string} token - JWT token
   * @returns {Promise<Object>} Weekly hours data
   */
  async getWeeklyHours(token) {
    try {
      const response = await springBootClient.get('/api/shifts/weekly-hours', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new ShiftService();


