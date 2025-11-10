import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import shiftRoutes from './routes/shifts.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'; // local dev fallback

// Dynamic CORS configuration
const allowedOrigins = [FRONTEND_URL];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // allow requests
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Shift Tracker BFF is running',
    backendUrl: BACKEND_URL,
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/shifts', shiftRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Shift Tracker BFF running on http://localhost:${PORT}`);
  console.log(`🔗 Proxying requests to Backend at ${BACKEND_URL}`);
});
