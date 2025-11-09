# 🕒 Shift Tracker

> A full-stack web application for restaurants to digitally track employee shifts, replacing traditional paper timesheets with an automated, accurate, and efficient solution.

[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-green.svg)](https://spring.io/projects/spring-boot)
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

### Frontend
- **React 18.2.0** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **Lucide React** - Icon library
- **Axios/Fetch API** - HTTP requests

### Database
- **MySQL 8.0** - Relational database
- Optimized schema with indexes
- Foreign key constraints
- Transaction support

### Development Tools
- **Eclipse IDE** - Backend development
- **VS Code** - Frontend development
- **MySQL Workbench** - Database management
- **Postman** - API testing
- **Git & GitHub** - Version control

---

## 🏗️ Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  React Frontend │ ◄─────► │  Spring Boot    │ ◄─────► │  MySQL Database │
│  (Port 3000)    │  REST   │  Backend        │  JDBC   │  (Port 3306)    │
│                 │  API    │  (Port 8080)    │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
        │                           │                           │
        │                           │                           │
   ┌────▼────┐              ┌──────▼──────┐            ┌──────▼──────┐
   │ Tailwind│              │   Spring    │            │  Employees  │
   │   CSS   │              │  Security   │            │   Table     │
   │         │              │  + JWT Auth │            │             │
   └─────────┘              └─────────────┘            │   Shifts    │
                                                       │   Table     │
                                                       └─────────────┘
```

### Key Design Patterns

- **MVC Pattern** - Separation of concerns
- **Repository Pattern** - Data access abstraction
- **DTO Pattern** - Data transfer objects for API
- **Dependency Injection** - Loose coupling
- **RESTful API** - Stateless communication

---


**Built with ❤️ by a developer who was tired of paper timesheets**
