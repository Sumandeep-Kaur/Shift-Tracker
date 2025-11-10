import express from 'express';
import authService from '../services/authService.js';

const router = express.Router();

/**
 * POST /api/auth/login
 * Login endpoint - forwards to Spring Boot
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const loginResponse = await authService.login(username, password);
    res.json(loginResponse);
  } catch (error) {
    console.error('Login error:', error);
    const status = error.status || 500;
    const message = error.message || 'Login failed';
    res.status(status).json({ error: message });
  }
});

export default router;


