# AgriStock AI - Quick Start Guide

## 🚀 Getting Started (Development)

### Prerequisites
- Python 3.9+
- Node.js 16+
- Git

---

## Backend Setup

### 1. Navigate to backend folder
```bash
cd backend
```

### 2. Install Python dependencies
```bash
pip install -r requirements.txt
```

### 3. Database is pre-configured
- The `.env` file uses SQLite by default (`agristock.db`)
- No PostgreSQL setup needed for development
- Database tables will auto-create on first run

### 4. Run the backend server
```bash
python app.py
```

✅ Backend will start at: **http://localhost:5000**

You should see:
```
 * Running on http://localhost:5000
 * Debug mode: on
```

---

## Frontend Setup

### 1. Open a new terminal and navigate to frontend
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```

✅ Frontend will start at: **http://localhost:5173** (or another port)

---

## Testing the Authentication

### First Time User Flow:
1. Open **http://localhost:5173** (or the URL from `npm run dev`)
2. You'll see the **Login/Signup** page
3. Click **"Don't have an account? Sign Up"**
4. Enter:
   - Email: `test@example.com` (or any valid email)
   - Password: `password123`
   - Confirm Password: `password123`
5. Click **Create Account**
6. You should see "User registered successfully"
7. Now log in with the same credentials
8. After login, you'll see the main app!

---

## Troubleshooting

### Problem: "Signup failed"

**Solution 1: Check if backend is running**
```bash
# In backend folder, run:
python app.py

# You should see:
# * Running on http://localhost:5000
```

**Solution 2: Check if frontend is connecting to correct backend**
- The frontend should auto-detect localhost in development
- If still failing, check browser console (F12) for errors

**Solution 3: Delete old database and restart**
```bash
# In backend folder:
rm agristock.db
python app.py
```

### Problem: "Invalid email" error
- Make sure email format is: `user@domain.com`
- Example: `john@gmail.com` ✅

### Problem: Port 5000 already in use
```bash
# Change port in backend/app.py:
app.run(debug=True, port=5001)  # Use different port
```

---

## API Testing (Optional - Using Postman/Curl)

### Sign Up
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "confirm_password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

---

## File Structure

```
AgriStock/
├── backend/
│   ├── app.py                 # Main Flask app
│   ├── .env                   # Configuration
│   ├── requirements.txt        # Python dependencies
│   ├── models/
│   │   └── user.py           # User database model
│   ├── routes/
│   │   ├── auth.py           # Authentication endpoints
│   │   ├── demand.py         # Prediction routes
│   │   └── risk.py           # Risk routes
│   └── utils/
│       └── validators.py     # Email validation
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Main app (with auth logic)
│   │   ├── pages/
│   │   │   ├── AuthPage.jsx  # Login/Signup form
│   │   │   ├── Home.jsx
│   │   │   ├── PredictionPage.jsx
│   │   │   └── AboutPage.jsx
│   │   └── components/
│   │       ├── Navbar.jsx    # Navigation (with logout)
│   │       └── ...
│   └── package.json
```

---

## Next Steps

1. ✅ Run backend: `python app.py`
2. ✅ Run frontend: `npm run dev`
3. ✅ Test signup/login
4. ✅ Make predictions with authentication!

---

## Production Deployment

For deploying to production (Render, Heroku, etc.):
1. Update `.env` with PostgreSQL credentials
2. Update frontend API_BASE to production URL
3. Push to GitHub
4. Deploy using platform's integration

See `AUTH_SETUP.md` for detailed production setup.
