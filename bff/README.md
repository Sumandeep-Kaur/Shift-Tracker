# Shift Tracker BFF (Backend for Frontend)

Express.js BFF layer that sits between the React frontend and Spring Boot backend, optimized for frontend needs.

## Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐         ┌─────────────┐
│             │         │              │         │             │         │             │
│   React     │ ──────► │   Express    │ ──────► │  Spring     │ ──────► │   MySQL     │
│  Frontend   │         │     BFF      │         │    Boot     │         │  Database   │
│  (Port 5173)│         │  (Port 3000)  │         │ (Port 8080) │         │  (Port 3306)│
│             │         │              │         │             │         │             │
└─────────────┘         └──────────────┘         └─────────────┘         └─────────────┘
```

## What is a BFF?

A **Backend for Frontend (BFF)** is a pattern where you create a backend service specifically tailored to the needs of a particular frontend application. Unlike a simple proxy, a BFF:

- **Aggregates data** from multiple backend services
- **Transforms responses** to match frontend requirements
- **Optimizes API calls** by combining multiple requests
- **Handles frontend-specific logic** and business rules
- **Provides a clean, frontend-optimized API**

## Features

- ✅ **Service Layer Architecture** - Clean separation of concerns
- ✅ **Error Handling** - Graceful error handling and transformation
- ✅ **Request Logging** - Track all API requests
- ✅ **Rate Limiting** - Protect against abuse
- ✅ **CORS Configuration** - Proper CORS setup for frontend
- ✅ **Token Forwarding** - Seamless JWT token forwarding to Spring Boot
- ✅ **Health Checks** - Monitor BFF status

## Prerequisites

- Node.js (v18 or higher)
- Spring Boot backend running (default: `http://localhost:8080`)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
PORT=3000
SPRING_BOOT_URL=http://localhost:8080
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

## Running the BFF

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The BFF server will start on `http://localhost:3000` and forward requests to your Spring Boot backend.

## Configuration

### Update Frontend API URL

In `frontend/src/services/api.ts`, change:
```typescript
const API_BASE_URL = "http://localhost:3000/api";
```

## API Endpoints

All endpoints match the Spring Boot API structure:

### Authentication
- `POST /api/auth/login` - Login user

### Admin Routes (requires admin role)
- `GET /api/admin/employees` - Get all employees
- `POST /api/admin/employees` - Create new employee
- `PUT /api/admin/employees/:id` - Update employee
- `DELETE /api/admin/employees/:id` - Delete employee
- `GET /api/admin/weekly-hours` - Get all employees' weekly hours

### Shift Routes (requires authentication)
- `POST /api/shifts/clock-in` - Clock in
- `POST /api/shifts/clock-out` - Clock out
- `GET /api/shifts/active` - Get active shift
- `GET /api/shifts/weekly-hours` - Get current user's weekly hours

## Project Structure

```
backend-express/
├── config/
│   └── springBootClient.js    # Axios client for Spring Boot
├── services/
│   ├── authService.js          # Authentication service
│   ├── employeeService.js      # Employee management service
│   └── shiftService.js         # Shift tracking service
├── routes/
│   ├── auth.js                 # Auth routes
│   ├── admin.js                # Admin routes
│   └── shifts.js               # Shift routes
├── middleware/
│   └── auth.js                # Auth middleware
├── .env.example                # Environment variables template
├── package.json                # Dependencies
├── server.js                   # Main server file
└── README.md                   # This file
```

## Benefits of BFF Pattern

1. **Frontend Optimization**: API responses tailored to frontend needs
2. **Reduced Backend Load**: Can aggregate multiple calls into one
3. **Frontend-Specific Logic**: Handle UI-specific business rules
4. **Easier Frontend Development**: Clean, consistent API
5. **Future Flexibility**: Easy to add caching, transformation, etc.

## Development

The BFF forwards all requests to Spring Boot while providing:
- Better error messages
- Request/response logging
- Rate limiting
- CORS handling
- Future extensibility for caching, aggregation, etc.

## Error Handling

The BFF catches errors from Spring Boot and transforms them into frontend-friendly error responses:
- 401: Authentication required
- 403: Access denied
- 404: Resource not found
- 500: Internal server error
- 503: Backend unavailable
