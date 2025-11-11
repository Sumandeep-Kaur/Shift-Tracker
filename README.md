# 🕒 Shift Tracker

> A full-stack web application for restaurants to digitally track employee shifts, replacing traditional paper timesheets with an automated, accurate, and efficient solution.

[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-green.svg)](https://spring.io/projects/spring-boot)
[![Node.js](https://img.shields.io/badge/Node.js-20-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📖 Table of Contents

- [About The Project](#about-the-project)
- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)

---

## 🎯 About The Project

This project was born out of a real-world problem I experienced working as a server at a restaurant. We were using paper timesheets to manually track employee shifts - writing down clock-in and clock-out times by hand. This led to numerous issues including lost timesheets, illegible handwriting, calculation errors, and hours of manual work for managers during payroll processing.

The Restaurant Shift Tracker is a modern, digital solution that eliminates these problems by providing:
- ✅ One-click clock in/out functionality
- ✅ Automatic hours calculation
- ✅ Real-time shift tracking
- ✅ Secure role-based access
- ✅ Mobile-responsive design
- ✅ Zero paper waste

---

## 🔴 Problem Statement

### The Manual Process

At my restaurant, employees would:
1. Write their name on a paper timesheet
2. Manually write clock-in time when starting shift
3. Manually write clock-out time when ending shift
4. Manager calculates total hours at week-end (prone to errors)
5. Paper sheets get lost, damaged, or misplaced

### Issues Identified

| Problem | Impact |
|---------|--------|
| 📝 **Manual Entry Errors** | Illegible handwriting, wrong times, missing entries |
| ⏰ **Calculation Mistakes** | Payroll errors affecting employee wages |
| 🔍 **No Accountability** | Disputes about hours worked with no audit trail |
| 📊 **Limited Data Access** | Cannot track labor costs or analyze patterns |
| 💸 **Time-Consuming** | Managers spend 3-5 hours weekly on payroll processing |
| 📄 **Paper Waste** | Environmental impact and storage issues |

---

## ✨ Solution

A **full-stack web application** that digitizes the entire shift tracking process:

### For Employees
- Secure login with personal credentials
- One-click clock in when shift starts
- One-click clock out when shift ends
- View current shift status in real-time
- Track total weekly hours automatically
- Access shift history anytime, anywhere

### For Managers/Admins
- Complete employee management (add, edit, delete)
- View all employees' weekly hours at a glance
- See detailed shift history with exact timestamps
- Real-time monitoring of active shifts
- Export-ready data for payroll processing
- Audit trail for accountability

---

## 🚀 Features

### 👨‍💼 Admin Features

- **Employee Management**
  - Create new employee accounts with credentials
  - Update employee information
  - Delete employee accounts (with safeguards)
  - View complete employee roster

- **Shift Monitoring**
  - Real-time dashboard of active shifts
  - View all employees' weekly hours
  - See detailed clock-in/clock-out history
  - Track shift patterns and trends

- **Reporting**
  - Weekly hours summary for all employees
  - Individual employee shift history
  - Exportable data for payroll integration

### 👔 Employee Features

- **Time Tracking**
  - Quick clock-in button
  - Quick clock-out button
  - View current shift status
  - Automatic hours calculation

- **Personal Dashboard**
  - Total weekly hours display
  - Current week shift history
  - Real-time shift timer
  - Clean, intuitive interface

### 🔐 Security Features

- JWT-based authentication
- Role-based access control (Admin/Employee)
- Secure password encryption (BCrypt)
- Protected API endpoints
- Session management

---

## 🛠️ Technology Stack

### Backend
- **Java 21** - Programming language
- **Spring Boot 3.2.0** - Application framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Database abstraction
- **JWT (JSON Web Tokens)** - Secure authentication
- **Maven** - Dependency management

### BFF (Backend for Frontend)
- **Node.js 20** - JavaScript runtime
- **Express.js** - Web application framework
- **Axios** - HTTP client for backend communication
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **React 18.2.0** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **React Router** - Client-side routing
- **React Icons** - Icon library

### Database
- **MySQL 8.0** - Relational database
- Optimized schema with indexes
- Foreign key constraints
- Transaction support
  

### Development Tools
- **Eclipse IDE** - Backend development
- **VS Code** - Frontend & BFF development
- **MySQL Workbench** - Database management
- **Postman** - API testing
- **Git & GitHub** - Version control
- **Railway** - Deployment

---


## 🏗️ Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │         │                 │
│  React Frontend │ ◄─────► │   Node.js BFF   │ ◄─────► │  Spring Boot    │ ◄─────► │  MySQL Database │
│  (Port 5173)    │  HTTP   │  (Port 3000)    │  REST   │  Backend        │  JDBC   │  (Port 3306)    │
│                 │         │                 │  API    │  (Port 8080)    │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘         └─────────────────┘
        │                           │                           │                           │
        │                           │                           │                           │
   ┌────▼────┐               ┌──────▼──────┐             ┌──────▼──────┐             ┌──────▼──────┐
   │ Tailwind│               │   API       │             │   Spring    │             │  Employees  │
   │   CSS   │               │  Gateway    │             │  Security   │             │   Table     │
   │         │               │  + Routing  │             │  + JWT Auth │             │             │
   │ React   │               │             │             │             │             │   Shifts    │
   │ Router  │               │  Request    │             │  Business   │             │   Table     │
   │         │               │  Validation │             │  Logic      │             │             │
   └─────────┘               └─────────────┘             └─────────────┘             └─────────────┘
```

---

### Three-Tier Architecture

#### 1. **Presentation Layer (Frontend)**
- React-based single-page application
- Responsive UI with Tailwind CSS
- Client-side routing with React Router
- State management with React Context
- Type-safe development with TypeScript

#### 2. **API Gateway Layer (BFF - Backend for Frontend)**
- Node.js/Express.js middleware layer
- Acts as a proxy between frontend and backend
- Handles CORS and request forwarding
- API endpoint consolidation
- Request/response transformation
- Environment-specific configuration

#### 3. **Business Logic Layer (Backend)**
- Spring Boot RESTful API
- JWT authentication and authorization
- Business logic and validation
- Database operations via JPA/Hibernate
- Secure password encryption

#### 4. **Data Layer (Database)**
- MySQL relational database
- Normalized schema design
- Foreign key relationships
- Indexed queries for performance

### Key Design Patterns

- **BFF Pattern** - Backend for Frontend for API abstraction
- **MVC Pattern** - Separation of concerns
- **Repository Pattern** - Data access abstraction
- **DTO Pattern** - Data transfer objects for API
- **Dependency Injection** - Loose coupling
- **RESTful API** - Stateless communication
- **JWT Authentication** - Secure token-based auth

---

### API Flow Example

```
User Action (Clock In)
        │
        ▼
┌────────────────────┐
│ React Component    │ 1. User clicks "Clock In"
│ (EmployeeDashboard)│
└────────┬───────────┘
         │ HTTP POST
         ▼
┌────────────────────┐
│ BFF Layer          │ 2. Forwards request to backend
│ (api.service.ts)   │    with JWT token
└────────┬───────────┘
         │ HTTP POST
         ▼
┌────────────────────┐
│ Spring Boot        │ 3. Validates JWT
│ (ShiftController)  │ 4. Creates shift record
└────────┬───────────┘ 5. Returns shift data
         │
         ▼
┌────────────────────┐
│ MySQL Database     │ 6. Persists shift data
│ (shifts table)     │
└────────────────────┘
```

---

## 📋 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Employee Management (Admin Only)
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create new employee
- `PUT /api/employees/{id}` - Update employee
- `DELETE /api/employees/{id}` - Delete employee

### Shift Tracking
- `POST /api/shifts/clock-in` - Clock in
- `POST /api/shifts/clock-out` - Clock out
- `GET /api/shifts/current` - Get current shift
- `GET /api/shifts/weekly` - Get weekly hours
- `GET /api/shifts/weekly/all` - Get all employees' weekly hours (Admin)

---

## 🔒 Security Implementation

### Authentication Flow
1. User submits credentials
2. Backend validates against database
3. JWT token generated with user info and role
4. Token sent to frontend and stored
5. Token included in subsequent requests
6. Backend validates token on each request

### Authorization
- **Employee Role**: Can only access own shift data
- **Admin Role**: Can access all employee data and management features
- Protected routes with role-based guards
- Secure password hashing with BCrypt

---

**Built with ❤️ by a developer who was tired of paper timesheets**
