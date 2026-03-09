---

# Inest Backend API

This is the backend API for the Inest project. It powers the platform features related to student housing and community services.

The API currently includes four main service modules:

* Laundry Services
* Home Baker Services
* Medical Services
* WhistleNest (an anonymous reporting system)

---

# Project Structure

```
inest-backend/
├── models/
│   ├── User.js
│   ├── Laundry.js
│   ├── HomeBaker.js
│   ├── Medical.js
│   └── WhistleNest.js
├── controllers/
│   ├── userController.js
│   ├── laundryController.js
│   ├── bakerController.js
│   ├── medicalController.js
│   └── whistleNestController.js
├── routes/
│   ├── userRoutes.js
│   ├── laundryRoutes.js
│   ├── bakerRoutes.js
│   ├── medicalRoutes.js
│   └── whistleNestRoutes.js
├── middleware/
│   ├── auth.js
│   └── role.js
├── app.js
├── server.js
├── package.json
└── README.md
```

---

# Setup and Installation

## Prerequisites

Before running the project, make sure the following are installed:

* Node.js (version 14 or higher)
* MongoDB (local installation or MongoDB Atlas)
* npm or yarn

---

## Installation Steps

### 1. Clone or download the project

Download the repository or clone it using Git.

### 2. Install dependencies

Run the following command in the project directory:

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory and add the following:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/inest
JWT_SECRET=your_super_secret_jwt_key_here
```

### 4. Start MongoDB

Make sure MongoDB is running locally or connect using MongoDB Atlas.

### 5. Start the server

Run the production server:

```bash
npm start
```

For development with automatic restart:

```bash
npx nodemon server.js
```

### 6. Verify the server

If everything is set up correctly, the server will run at:

```
http://localhost:5000
```

If you are using the deployed backend:

```
https://inest-website.onrender.com
```

You should see messages like:

```
MongoDB connected
Server running on port 5000
```

---

# Authentication and Authorization

The system uses JWT (JSON Web Tokens) for authentication.

Tokens expire after 7 days.

Include the token in the request header like this:

```
Authorization: Bearer <your_token>
```

---

# User Roles

Different roles have different permissions in the system.

student
Basic user access

owner
Can manage laundry services

cook
Can manage home baker services

admin
Can manage medical services and view all WhistleNest reports

---

# API Base URL

```
https://inest-website.onrender.com/api
```

---

# User Management

## Register a user

```
POST /api/users/register
```

Example request body:

```json
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

Example request body:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

The response includes a JWT token which should be used for authenticated requests.

---

# Laundry Services

Base route:

```
/api/laundry
```

## Get all laundry services

```
GET /api/laundry
```

This endpoint is public.

---

## Add a laundry service

```
POST /api/laundry
```

Requires an **owner role**.

Example:

```json
{
  "name": "QuickWash Laundry",
  "contact": "+1-555-0123",
  "price": 150,
  "pickupAvailable": true,
  "timing": "8am-8pm"
}
```

---

## Update a laundry service

```
PUT /api/laundry/:id
```

Requires owner role.

---

## Delete a laundry service

```
DELETE /api/laundry/:id
```

Requires owner role.

---

# Home Baker Services

Base route:

```
/api/bakers
```

## Get all home bakers

```
GET /api/bakers
```

Public endpoint.

---

## Add a home baker

```
POST /api/bakers
```

Requires **cook role**.

Example:

```json
{
  "name": "Sweet Home Bakery",
  "menu": ["Chocolate Cake", "Vanilla Cupcakes", "Bread Loaf", "Cookies"],
  "delivery": true,
  "rating": 4.5,
  "contact": "+1-555-0456"
}
```

---

## Update a home baker

```
PUT /api/bakers/:id
```

Requires cook role.

---

## Delete a home baker

```
DELETE /api/bakers/:id
```

Requires cook role.

---

# Medical Services

Base route:

```
/api/medicals
```

## Get all medical services

```
GET /api/medicals
```

Public endpoint.

---

## Add a medical service

```
POST /api/medicals
```

Requires **admin role**.

Example:

```json
{
  "name": "City Pharmacy",
  "type": "pharmacy",
  "address": "123 Main Street, Downtown",
  "contact": "+1-555-0789",
  "hasDelivery": true
}
```

---

## Update a medical service

```
PUT /api/medicals/:id
```

Requires admin role.

---

## Delete a medical service

```
DELETE /api/medicals/:id
```

Requires admin role.

---

# WhistleNest (Anonymous Reporting)

Base route:

```
/api/whistlenest
```

This feature allows users to submit complaints, suggestions, or reports.

Reports can be submitted anonymously.

---

## Submit an anonymous report

```
POST /api/whistlenest
```

Example:

```json
{
  "subject": "Noise Complaint",
  "description": "Loud music playing at 2 AM from room 305",
  "type": "abuse"
}
```

No login required.

---

## Submit a report with authentication

If the user is logged in, their user ID will be attached to the report.

---

## Get user's reports

```
GET /api/whistlenest/user
```

Requires login.

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

```json
{
  "status": "under_review"
}
```

Requires admin role.

---

# Data Models

## User

```
name
email (unique)
password (hashed)
role (student, owner, cook, admin)
```

---

## Laundry

```
name
contact
price
pickupAvailable
timing
ownerId
```

---

## Home Baker

```
name
menu
delivery
rating
contact
```

---

## Medical

```
name
type (emergency or pharmacy)
address
contact
hasDelivery
```

---

## WhistleNest

```
subject
description
type (abuse, service issue, suggestion)
status (pending, under_review, resolved)
userId (optional)
```

---

# Testing Guide

You can test the API using tools like:

* Postman
* Thunder Client

Recommended testing flow:

1. Register users with different roles.
2. Save their JWT tokens.
3. Test public endpoints.
4. Test protected endpoints using the correct role tokens.
5. Verify role-based access control.

---

# Common HTTP Status Codes

200 – Success
201 – Created
400 – Bad Request
401 – Unauthorized
403 – Forbidden
404 – Not Found
500 – Internal Server Error

---

# Development

## Available Scripts

Start the server:

```
npm start
```

Run tests (not implemented yet):

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

* Make sure MongoDB is running before starting the server.
* Include the JWT token in the Authorization header for protected routes.
* Each module has role-based access restrictions.
* WhistleNest allows anonymous submissions.
* Basic validation is applied to all endpoints.

---

# Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Test thoroughly
5. Submit a pull request

---

# Support

For issues or questions, contact the project maintainer.

---

Version: 1.0.0
Last Updated: 2024

---
