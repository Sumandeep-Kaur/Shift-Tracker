import express from 'express';
import shiftService from '../services/shiftService.js';
import { attachToken } from '../middleware/auth.js';

const router = express.Router();

// All shift routes require authentication
router.use(attachToken);

/**
 * POST /api/shifts/clock-in
 * Clock in for current user
 */
router.post('/clock-in', async (req, res) => {
  try {
    if (!req.token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const shift = await shiftService.clockIn(req.token);
    res.status(201).json(shift);
  } catch (error) {
    console.error('Clock in error:', error);
    const status = error.status || 500;
    const message = error.message || 'Failed to clock in';
    res.status(status).json({ error: message });
  }
});

/**
 * POST /api/shifts/clock-out
 * Clock out for current user
 */
router.post('/clock-out', async (req, res) => {
  try {
    if (!req.token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const shift = await shiftService.clockOut(req.token);
    res.json(shift);
  } catch (error) {
    console.error('Clock out error:', error);
    const status = error.status || 500;
    const message = error.message || 'Failed to clock out';
    res.status(status).json({ error: message });
  }
});

/**
 * GET /api/shifts/active
 * Get active shift for current user
 */
router.get('/active', async (req, res) => {
  try {
    if (!req.token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const activeShift = await shiftService.getActiveShift(req.token);
    if (activeShift) {
      res.json(activeShift);
    } else {
      res.status(404).json({ error: 'No active shift found' });
    }
  } catch (error) {
    console.error('Get active shift error:', error);
    const status = error.status || 500;
    const message = error.message || 'Failed to fetch active shift';
    res.status(status).json({ error: message });
  }
});

/**
 * GET /api/shifts/weekly-hours
 * Get weekly hours for current user
 */
router.get('/weekly-hours', async (req, res) => {
  try {
    if (!req.token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const weeklyHours = await shiftService.getWeeklyHours(req.token);
    res.json(weeklyHours);
  } catch (error) {
    console.error('Get weekly hours error:', error);
    const status = error.status || 500;
    const message = error.message || 'Failed to fetch weekly hours';
    res.status(status).json({ error: message });
  }
});

export default router;


