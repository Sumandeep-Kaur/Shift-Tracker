import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const SPRING_BOOT_URL = process.env.SPRING_BOOT_URL || 'http://localhost:8080';

// Create axios instance for Spring Boot backend
const springBootClient = axios.create({
  baseURL: SPRING_BOOT_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to forward auth token
springBootClient.interceptors.request.use(
  (config) => {
    // Forward Authorization header if present
    const authHeader = config.headers?.Authorization;
    if (!authHeader && config.headers?.authorization) {
      config.headers.Authorization = config.headers.authorization;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
springBootClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Spring Boot returned an error response
      return Promise.reject({
        status: error.response.status,
        message: error.response.data?.error || error.response.data?.message || 'Backend error',
        data: error.response.data,
      });
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject({
        status: 503,
        message: 'Spring Boot backend is unavailable',
        originalError: error.message,
      });
    } else {
      // Error setting up the request
      return Promise.reject({
        status: 500,
        message: 'Request setup error',
        originalError: error.message,
      });
    }
  }
);

export default springBootClient;


