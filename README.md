---

# Inest Backend API

This repository contains the backend API for the **Inest platform**, which provides services related to student housing and community management.

The backend currently supports four main service modules:

* Laundry Services
* Home Baker Services
* Medical Services
* WhistleNest (anonymous reporting system)

The API is built using **Node.js, Express.js, and MongoDB** and follows a modular architecture with models, controllers, and routes.

---

# Project Structure

```
inest-backend/
│
├── models/
│   ├── User.js
│   ├── Laundry.js
│   ├── HomeBaker.js
│   ├── Medical.js
│   └── WhistleNest.js
│
├── controllers/
│   ├── userController.js
│   ├── laundryController.js
│   ├── bakerController.js
│   ├── medicalController.js
│   └── whistleNestController.js
│
├── routes/
│   ├── userRoutes.js
│   ├── laundryRoutes.js
│   ├── bakerRoutes.js
│   ├── medicalRoutes.js
│   └── whistleNestRoutes.js
│
├── middleware/
│   ├── auth.js
│   └── role.js
│
├── app.js
├── server.js
├── package.json
└── README.md
```

---

# Setup and Installation

## Prerequisites

Make sure the following tools are installed:

* Node.js (v14 or higher)
* MongoDB (local installation or MongoDB Atlas)
* npm or yarn

---

## Installation Steps

### 1. Clone the repository

```
git clone https://github.com/vsm-0/inest-website.git
```

Navigate to the backend directory.

---

### 2. Install dependencies

```
npm install
```

---

### 3. Create environment variables

Create a `.env` file in the root folder and add:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/inest
JWT_SECRET=your_super_secret_jwt_key_here
```

---

### 4. Start MongoDB

Make sure MongoDB is running locally or connect to MongoDB Atlas.

---

### 5. Start the server

Run the production server:

```
npm start
```

For development with automatic restart:

```
npx nodemon server.js
```

---

### 6. Verify the server

The server should start at:

```
http://localhost:5000
```

If you are using the deployed backend:

```
https://inest-website.onrender.com
```

You should see messages such as:

```
MongoDB connected
Server running on port 5000
```

---

# Authentication and Authorization

The system uses **JWT (JSON Web Tokens)** for authentication.

Tokens expire after **7 days**.

Include the token in the request header like this:

```
Authorization: Bearer <your_token>
```

---

# User Roles

Different roles control access to different features.

| Role    | Permissions                                          |
| ------- | ---------------------------------------------------- |
| student | Basic user access                                    |
| owner   | Manage laundry services                              |
| cook    | Manage home baker services                           |
| admin   | Manage medical services and view WhistleNest reports |

---

# API Base URL

```
https://inest-website.onrender.com/api
```

---

# User Management

## Register User

```
POST /api/users/register
```

Example request:

```
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

---

## Login

```
POST /api/users/login
```

Example request:

```
{
  "email": "john@example.com",
  "password": "password123"
}
```

The response returns a **JWT token** that should be used for authenticated requests.

---

# Laundry Services

Base route

```
/api/laundry
```

## Get all laundry services

```
GET /api/laundry
```

Public endpoint.

---

## Add laundry service

```
POST /api/laundry
```

Requires **owner role**.

Example:

```
{
  "name": "QuickWash Laundry",
  "contact": "+1-555-0123",
  "price": 150,
  "pickupAvailable": true,
  "timing": "8am-8pm"
}
```

---

## Update laundry service

```
PUT /api/laundry/:id
```

Requires owner role.

---

## Delete laundry service

```
DELETE /api/laundry/:id
```

Requires owner role.

---

# Home Baker Services

Base route

```
/api/bakers
```

## Get all home bakers

```
GET /api/bakers
```

Public endpoint.

---

## Add home baker

```
POST /api/bakers
```

Requires **cook role**.

Example:

```
{
  "name": "Sweet Home Bakery",
  "menu": ["Chocolate Cake", "Vanilla Cupcakes", "Bread Loaf", "Cookies"],
  "delivery": true,
  "rating": 4.5,
  "contact": "+1-555-0456"
}
```

---

## Update home baker

```
PUT /api/bakers/:id
```

Requires cook role.

---

## Delete home baker

```
DELETE /api/bakers/:id
```

Requires cook role.

---

# Medical Services

Base route

```
/api/medicals
```

## Get all medical services

```
GET /api/medicals
```

Public endpoint.

---

## Add medical service

```
POST /api/medicals
```

Requires **admin role**.

Example:

```
{
  "name": "City Pharmacy",
  "type": "pharmacy",
  "address": "123 Main Street, Downtown",
  "contact": "+1-555-0789",
  "hasDelivery": true
}
```

---

## Update medical service

```
PUT /api/medicals/:id
```

Requires admin role.

---

## Delete medical service

```
DELETE /api/medicals/:id
```

Requires admin role.

---

# WhistleNest (Anonymous Reporting)

Base route

```
/api/whistlenest
```

This feature allows users to submit complaints, service issues, or suggestions.

Reports can be submitted anonymously.

---

## Submit anonymous report

```
POST /api/whistlenest
```

Example:

```
{
  "subject": "Noise Complaint",
  "description": "Loud music playing at 2 AM from room 305",
  "type": "abuse"
}
```

---

## Get user's reports

```
GET /api/whistlenest/user
```

Requires authentication.

---

## Get all reports (admin)

```
GET /api/whistlenest/admin
```

Requires admin role.

---

## Update report status

```
PATCH /api/whistlenest/:id/status
```

Example:

```
{
  "status": "under_review"
}
```

---

# Testing the API

You can test the API using:

* Postman
* Thunder Client

Recommended testing flow:

1. Register users with different roles.
2. Save their JWT tokens.
3. Test public endpoints.
4. Test protected endpoints using the appropriate role tokens.
5. Verify role-based access restrictions.

---

# Common HTTP Status Codes

| Code | Meaning      |
| ---- | ------------ |
| 200  | Success      |
| 201  | Created      |
| 400  | Bad request  |
| 401  | Unauthorized |
| 403  | Forbidden    |
| 404  | Not found    |
| 500  | Server error |

---

# Development Scripts

Start the server

```
npm start
```

Run tests

```
npm test
```

---

# Environment Variables

```
PORT
MONGO_URI
JWT_SECRET
```

---

# Notes

* MongoDB must be running before starting the server.
* JWT tokens must be included for protected routes.
* Each module uses role-based access control.
* WhistleNest allows anonymous reports.
* Basic validation is implemented in all endpoints.

---

# Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

# Support

For questions or issues, contact the project maintainer.

---

Version: 1.0.0
Last Updated: 2024

---
