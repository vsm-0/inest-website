# Inest Backend API

A comprehensive backend API for the Inest project, providing services for student housing and community management. This API includes four main modules: Laundry Services, Home Baker Services, Medical Services, and WhistleNest (anonymous reporting system).

## 📦 Project Structure

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

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation Steps

1. **Clone or download the project**
2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/inest
   JWT_SECRET=your_super_secret_jwt_key_here
   ```

4. **Start MongoDB** (locally or use MongoDB Atlas)

5. **Start the server:**
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npx nodemon server.js
   ```

6. **Verify the server is running:**
   - Server should start on `http://localhost:5000`
   - You should see "MongoDB connected" and "Server running on port 5000"

## 🔐 Authentication & Authorization

### User Roles
- **student**: Basic user access
- **owner**: Can manage laundry services
- **cook**: Can manage home baker services
- **admin**: Can manage medical services and view all WhistleNest reports

### JWT Token
- Tokens expire after 7 days
- Include in headers: `Authorization: Bearer <your_token>`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

---

## 👤 User Management

### Register User
```http
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

### Login
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response includes JWT token for authenticated requests.**

---

## 🧺 Laundry Services

**Base URL:** `/api/laundry`

### Get All Laundry Services
```http
GET /api/laundry
```
**Public endpoint - no authentication required**

### Add New Laundry Service
```http
POST /api/laundry
Authorization: Bearer <owner_token>
Content-Type: application/json

{
  "name": "QuickWash Laundry",
  "contact": "+1-555-0123",
  "price": 150,
  "pickupAvailable": true,
  "timing": "8am-8pm"
}
```
**Requires: owner role**

### Update Laundry Service
```http
PUT /api/laundry/:id
Authorization: Bearer <owner_token>
Content-Type: application/json

{
  "price": 200,
  "pickupAvailable": false
}
```
**Requires: owner role**

### Delete Laundry Service
```http
DELETE /api/laundry/:id
Authorization: Bearer <owner_token>
```
**Requires: owner role**

---

## 🍰 Home Baker Services

**Base URL:** `/api/bakers`

### Get All Home Bakers
```http
GET /api/bakers
```
**Public endpoint - no authentication required**

### Add New Home Baker
```http
POST /api/bakers
Authorization: Bearer <cook_token>
Content-Type: application/json

{
  "name": "Sweet Home Bakery",
  "menu": ["Chocolate Cake", "Vanilla Cupcakes", "Bread Loaf", "Cookies"],
  "delivery": true,
  "rating": 4.5,
  "contact": "+1-555-0456"
}
```
**Requires: cook role**

### Update Home Baker
```http
PUT /api/bakers/:id
Authorization: Bearer <cook_token>
Content-Type: application/json

{
  "menu": ["Chocolate Cake", "Vanilla Cupcakes", "Bread Loaf", "Cookies", "Cheesecake"],
  "rating": 4.7
}
```
**Requires: cook role**

### Delete Home Baker
```http
DELETE /api/bakers/:id
Authorization: Bearer <cook_token>
```
**Requires: cook role**

---

## 🏥 Medical Services

**Base URL:** `/api/medicals`

### Get All Medical Services
```http
GET /api/medicals
```
**Public endpoint - no authentication required**

### Add New Medical Service
```http
POST /api/medicals
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "City Pharmacy",
  "type": "pharmacy",
  "address": "123 Main Street, Downtown",
  "contact": "+1-555-0789",
  "hasDelivery": true
}
```
**Requires: admin role**

### Update Medical Service
```http
PUT /api/medicals/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Updated City Pharmacy",
  "contact": "+1-555-9999",
  "hasDelivery": false
}
```
**Requires: admin role**

### Delete Medical Service
```http
DELETE /api/medicals/:id
Authorization: Bearer <admin_token>
```
**Requires: admin role**

---

## 🐦 WhistleNest (Anonymous Reporting)

**Base URL:** `/api/whistlenest`

### Submit Report (Anonymous)
```http
POST /api/whistlenest
Content-Type: application/json

{
  "subject": "Noise Complaint",
  "description": "Loud music playing at 2 AM from room 305",
  "type": "abuse"
}
```
**No authentication required - anonymous submissions allowed**

### Submit Report (Authenticated)
```http
POST /api/whistlenest
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "subject": "Suggestion for Study Room",
  "description": "Please add more study tables in the common area",
  "type": "suggestion"
}
```
**Optional authentication - includes userId in report**

### Get User's Own Reports
```http
GET /api/whistlenest/user
Authorization: Bearer <user_token>
```
**Requires: authenticated user**

### Get All Reports (Admin)
```http
GET /api/whistlenest/admin
Authorization: Bearer <admin_token>
```
**Requires: admin role**

### Update Report Status (Admin)
```http
PATCH /api/whistlenest/:id/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "under_review"
}
```
**Requires: admin role**

---

## 📋 Data Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['student', 'owner', 'cook', 'admin'])
}
```

### Laundry
```javascript
{
  name: String (required),
  contact: String (required),
  price: Number (required),
  pickupAvailable: Boolean (default: false),
  timing: String,
  ownerId: ObjectId (ref: 'User', required)
}
```

### HomeBaker
```javascript
{
  name: String (required),
  menu: [String] (array),
  delivery: Boolean (default: false),
  rating: Number (default: 0),
  contact: String (required)
}
```

### Medical
```javascript
{
  name: String (required),
  type: String (enum: ['emergency', 'pharmacy'], required),
  address: String (required),
  contact: String (required),
  hasDelivery: Boolean (default: false)
}
```

### WhistleNest
```javascript
{
  subject: String (required),
  description: String (required),
  type: String (enum: ['abuse', 'service issue', 'suggestion'], required),
  status: String (enum: ['pending', 'under_review', 'resolved'], default: 'pending'),
  userId: ObjectId (ref: 'User', nullable)
}
```

---

## 🧪 Testing Guide

### Using Postman/Thunder Client

1. **Start with User Registration:**
   - Register users with different roles (student, owner, cook, admin)
   - Save the JWT tokens for each role

2. **Test Public Endpoints:**
   - GET all services (laundry, bakers, medicals)
   - POST anonymous WhistleNest reports

3. **Test Protected Endpoints:**
   - Use appropriate role tokens for each module
   - Test unauthorized access (should return 401/403)

4. **Test CRUD Operations:**
   - Create, read, update, delete for each module
   - Verify role-based restrictions

### Sample Test Data

#### Register Different Users
```json
// Owner
{
  "name": "Laundry Owner",
  "email": "owner@test.com",
  "password": "password123",
  "role": "owner"
}

// Cook
{
  "name": "Home Baker",
  "email": "baker@test.com",
  "password": "password123",
  "role": "cook"
}

// Admin
{
  "name": "System Admin",
  "email": "admin@test.com",
  "password": "password123",
  "role": "admin"
}
```

---

## 🔧 Error Handling

### Common HTTP Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request (validation error)
- **401**: Unauthorized (missing/invalid token)
- **403**: Forbidden (insufficient role)
- **404**: Not Found
- **500**: Internal Server Error

### Error Response Format
```json
{
  "message": "Error description"
}
```

---

## 🛠️ Development

### Available Scripts
- `npm start`: Start production server
- `npm test`: Run tests (not implemented yet)

### Environment Variables
- `PORT`: Server port (default: 5000)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens

---

## 📝 Notes

- **MongoDB**: Ensure MongoDB is running before starting the server
- **JWT Tokens**: Include in Authorization header for protected routes
- **Role-Based Access**: Each module has specific role requirements
- **Anonymous Reporting**: WhistleNest allows submissions without authentication
- **Data Validation**: All endpoints include basic validation
- **Timestamps**: All models include createdAt and updatedAt fields

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📞 Support

For issues or questions, please contact the project maintainer.

---

**Version:** 1.0.0  
**Last Updated:** 2024 