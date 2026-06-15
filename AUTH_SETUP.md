# User Authentication Setup Guide

This guide explains how to set up and run the authentication system for AgriStock AI.

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure PostgreSQL Database

**Option A: Using PostgreSQL (Production)**
```bash
# Install PostgreSQL if not already installed
# Create a new database
createdb agristock_db

# Update .env file with your database credentials
# DATABASE_URL=postgresql://username:password@localhost:5432/agristock_db
```

**Option B: Using SQLite (Development)**
- Change `DATABASE_URL` in `.env` to:
```
DATABASE_URL=sqlite:///agristock.db
```

### 3. Set Environment Variables

Create a `.env` file in the `backend` folder:
```env
# PostgreSQL Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/agristock_db

# JWT Configuration (Generate a secure key)
JWT_SECRET_KEY=your-super-secret-key-here

# JWT Token Expiry (in seconds) - 3600 = 1 hour
JWT_ACCESS_TOKEN_EXPIRES=3600

# Flask Configuration
FLASK_ENV=development
DEBUG=True

# Email Configuration (optional, for future features)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

### 4. Run the Backend Server
```bash
python app.py
```

Backend will run at: `http://localhost:5000`

---

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Update API Base URL (if needed)
In `frontend/src/pages/AuthPage.jsx` and other components:
```javascript
const API_BASE = "http://localhost:5000/";  // For local development
```

### 3. Run Frontend Development Server
```bash
npm run dev
```

Frontend will run at: `http://localhost:5173`

---

## Authentication Endpoints

### 1. **Sign Up**
```
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "confirm_password": "password123"
}

Response (201):
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "is_verified": false,
    "created_at": "2026-06-16T..."
  }
}
```

### 2. **Login**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response (200):
{
  "message": "Login successful",
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "is_verified": false,
    "created_at": "2026-06-16T..."
  }
}
```

### 3. **Get User Profile**
```
GET /api/auth/profile
Headers:
  Authorization: Bearer <access_token>

Response (200):
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "is_verified": false,
    "created_at": "2026-06-16T..."
  }
}
```

### 4. **Logout**
```
POST /api/auth/logout
Headers:
  Authorization: Bearer <access_token>

Response (200):
{
  "message": "Logged out successfully"
}
```

---

## Email Validation Rules

- Must be a valid email format: `user@domain.com`
- Password must be at least 6 characters
- Passwords must match during sign up
- Email must be unique (cannot register with same email twice)

---

## JWT Token Management

1. **Token Storage**: Token is stored in `localStorage` as "token"
2. **Token Expiry**: Tokens expire after 1 hour by default (configurable in `.env`)
3. **Auto-Login**: Users are automatically logged in if valid token exists in localStorage
4. **Logout**: Tokens are removed from localStorage on logout

---

## Password Security

- Passwords are hashed using bcrypt (strength: 10 rounds)
- Never store plain text passwords
- Tokens are JWT-based (stateless authentication)

---

## Troubleshooting

### Error: "No module named 'flask_sqlalchemy'"
```bash
pip install flask-sqlalchemy
```

### Error: "database connection refused"
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env file
- Verify username and password

### Error: "Invalid email"
- Ensure email format is correct: `name@domain.extension`
- Email must have @ and domain

### Token Expired
- User will be redirected to login page
- Token automatically expires after 1 hour
- User needs to login again

---

## Next Steps (Future Enhancements)

- [ ] Email verification before using app
- [ ] Password reset functionality
- [ ] Two-factor authentication
- [ ] Social login (Google, GitHub)
- [ ] User profile management
- [ ] Password change functionality

---

## Support

For issues or questions, contact the development team.
