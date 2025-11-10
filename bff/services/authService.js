import springBootClient from '../config/springBootClient.js';

class AuthService {
  /**
   * Login user via Spring Boot backend
   * @param {string} username 
   * @param {string} password 
   * @returns {Promise<Object>} Login response with token and user info
   */
  async login(username, password) {
    try {
      const response = await springBootClient.post('/api/auth/login', {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService();


