import express from 'express';
import employeeService from '../services/employeeService.js';
import { attachToken } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication
router.use(attachToken);

/**
 * GET /api/admin/employees
 * Get all employees
 */
router.get('/employees', async (req, res) => {
  try {
    if (!req.token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const employees = await employeeService.getAllEmployees(req.token);
    res.json(employees);
  } catch (error) {
    console.error('Get employees error:', error);
    const status = error.status || 500;
    const message = error.message || 'Failed to fetch employees';
    res.status(status).json({ error: message });
  }
});

/**
 * POST /api/admin/employees
 * Create new employee
 */
router.post('/employees', async (req, res) => {
  try {
    if (!req.token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { name, username, password } = req.body;
    if (!name || !username || !password) {
      return res.status(400).json({ error: 'Name, username, and password are required' });
    }

    const employee = await employeeService.createEmployee(req.token, {
      name,
      username,
      password,
    });
    res.status(201).json(employee);
  } catch (error) {
    console.error('Create employee error:', error);
    const status = error.status || 500;
    const message = error.message || 'Failed to create employee';
    res.status(status).json({ error: message });
  }
});

/**
 * PUT /api/admin/employees/:id
 * Update employee
 */
router.put('/employees/:id', async (req, res) => {
  try {
    if (!req.token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { id } = req.params;
    const { name, username, password } = req.body;

    if (!name || !username) {
      return res.status(400).json({ error: 'Name and username are required' });
    }

    const updateData = { name, username };
    if (password) {
      updateData.password = password;
    }

    const employee = await employeeService.updateEmployee(req.token, id, updateData);
    res.json(employee);
  } catch (error) {
    console.error('Update employee error:', error);
    const status = error.status || 500;
    const message = error.message || 'Failed to update employee';
    res.status(status).json({ error: message });
  }
});

/**
 * DELETE /api/admin/employees/:id
 * Delete employee
 */
router.delete('/employees/:id', async (req, res) => {
  try {
    if (!req.token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { id } = req.params;
    await employeeService.deleteEmployee(req.token, id);
    res.status(204).send();
  } catch (error) {
    console.error('Delete employee error:', error);
    const status = error.status || 500;
    const message = error.message || 'Failed to delete employee';
    res.status(status).json({ error: message });
  }
});

/**
 * GET /api/admin/weekly-hours
 * Get all employees' weekly hours
 */
router.get('/weekly-hours', async (req, res) => {
  try {
    if (!req.token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const weeklyHours = await employeeService.getAllEmployeesWeeklyHours(req.token);
    res.json(weeklyHours);
  } catch (error) {
    console.error('Get weekly hours error:', error);
    const status = error.status || 500;
    const message = error.message || 'Failed to fetch weekly hours';
    res.status(status).json({ error: message });
  }
});

export default router;


