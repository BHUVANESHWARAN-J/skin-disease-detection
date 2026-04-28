# Setup & Installation Guide

## Prerequisites

- Python 3.9 or higher
- Node.js 16+ with npm
- Your trained Keras model files (`.keras` format)
- Your label encoder pickle file (`.pkl` format)

## Step-by-Step Installation

### Backend Setup

#### 1. Navigate to backend directory
```bash
cd d:\varshini_project\backend
```

#### 2. Install Python dependencies
```bash
pip install -r requirements.txt
```

Expected packages:
- Django 5.0.6
- Django REST Framework 3.15.1
- TensorFlow 2.16.1
- OpenCV for Grad-CAM
- Pillow for image handling
- etc.

#### 3. Copy your model files
Place these files in `backend/model/`:
```
backend/model/best_skin_model.keras
backend/model/label_encoder.pkl
```

#### 4. Configure environment variables
Edit `backend/.env`:
```
SECRET_KEY=django-secret-key-change-this
DEBUG=True
```

#### 5. Create database tables
```bash
python manage.py makemigrations
python manage.py migrate
```

#### 6. (Optional) Create admin user
```bash
python manage.py createsuperuser
# Enter username, email, password when prompted
```

#### 7. Start backend server
```bash
python manage.py runserver
```

You should see:
```
Starting development server at http://127.0.0.1:8000/
```

### Frontend Setup

#### 1. Navigate to frontend directory
```bash
cd d:\varshini_project\frontend
```

#### 2. Install npm dependencies
```bash
npm install
```

This installs:
- React 18.2
- Vite (build tool)
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling
- Chart.js for dashboards

#### 3. Start development server
```bash
npm run dev
```

You should see:
```
VITE v5.0.0  ready in 234 ms

➜  Local:   http://localhost:5173/
```

## Testing the Application

### 1. Open Frontend
Go to: `http://localhost:5173`

You should see the landing page with "🏥 AI Skin Disease Detection"

### 2. Register a New Account
- Click "Register"
- Enter username, email, password
- Click "Register" button
- Should see "Registered successfully!"

### 3. Login
- Click "Login"
- Enter your credentials
- Click "Login" button
- Should redirect to Upload page

### 4. Upload Test Image
- Click "Upload Image" or "Start Scan"
- Select an image of skin
- Click "Analyze Image"
- Wait for processing...

### 5. View Results
You should see:
- Predicted disease name
- Confidence percentage with progress bar
- Severity level (High/Moderate/Low)
- Medical priority
- Treatment recommendations
- AI Heatmap showing model's decision regions

### 6. Check History
- Click "History" in navbar
- See table of all past predictions
- Confidence bars, severity badges, dates

### 7. View Dashboard
- Click "Dashboard" in navbar
- See admin analytics:
  - Total predictions count
  - Disease distribution pie chart
  - Top disease statistics
  - Recent predictions table

## API Testing with Curl/Postman

### Register
```bash
curl -X POST http://127.0.0.1:8000/api/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"testpass123"}'
```

### Login
```bash
curl -X POST http://127.0.0.1:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass123"}'
```

Response will include JWT access token.

### Predict (with token)
```bash
curl -X POST http://127.0.0.1:8000/api/predict/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "image=@/path/to/image.jpg"
```

### Get Dashboard
```bash
curl -X GET http://127.0.0.1:8000/api/dashboard/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Troubleshooting

### Backend Issues

**Error: Module not found (TensorFlow, OpenCV, etc.)**
```bash
# Reinstall requirements
pip install -r requirements.txt --force-reinstall
```

**Error: Port 8000 already in use**
```bash
# Use different port
python manage.py runserver 8001
```

**Error: No such file or directory: model/best_skin_model.keras**
```bash
# Create model directory and place files there
mkdir -p backend/model
# Copy your model files to backend/model/
```

**Error: CSRF verification failed**
```bash
# Add to .env
CSRF_TRUSTED_ORIGINS=['http://localhost:5173']
```

### Frontend Issues

**Error: npm: command not found**
```bash
# Install Node.js from nodejs.org
# Then run: npm install
```

**Error: Cannot find module 'react'**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

**Error: Vite port 5173 already in use**
```bash
# Use different port
npm run dev -- --port 3000
```

**Frontend cannot connect to backend**
- Check backend is running on http://127.0.0.1:8000
- Check CORS settings in `backend/backend/settings.py`
- Make sure API URL is correct in `frontend/src/services/api.js`

### Image Upload Issues

**Error: Media directory not found**
```bash
# Create media directories
mkdir -p backend/media/uploads
mkdir -p backend/media/heatmaps
```

**Error: Permission denied writing to media**
```bash
# Fix permissions
chmod -R 755 backend/media
```

## Development Workflow

### Terminal 1 - Backend
```bash
cd backend
python manage.py runserver
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

### Terminal 3 - (Optional) Database/Logs
Keep this for monitoring if needed.

## Building for Production

### Frontend Build
```bash
cd frontend
npm run build
```

Creates optimized build in `frontend/dist/`

### Backend Production
```bash
# Install production server
pip install gunicorn

# Run with gunicorn
gunicorn backend.wsgi --bind 0.0.0.0:8000
```

## Environment Variables Checklist

### Backend (.env)
- [ ] SECRET_KEY set
- [ ] DEBUG=False (for production)
- [ ] Database credentials correct
- [ ] ALLOWED_HOSTS configured
- [ ] CORS settings correct

### Frontend (.env.local - if needed)
- [ ] API_URL pointing to backend
- [ ] Environment set to production

## File Structure After Setup

```
d:\varshini_project\
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env ✅
│   ├── db.sqlite3 ✅ (created after migrate)
│   ├── model/
│   │   ├── best_skin_model.keras ✅ (your file)
│   │   └── label_encoder.pkl ✅ (your file)
│   ├── media/ ✅ (created after first prediction)
│   │   ├── uploads/
│   │   └── heatmaps/
│   ├── backend/
│   ├── api/
│   └── ai/
│
└── frontend/
    ├── package.json
    ├── node_modules/ ✅ (created after npm install)
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    └── src/
```

✅ = Created during setup

## Common Commands Reference

```bash
# Backend commands
python manage.py runserver          # Start dev server
python manage.py makemigrations     # Create migrations
python manage.py migrate            # Apply migrations
python manage.py createsuperuser    # Create admin user
python manage.py shell              # Python interactive shell

# Frontend commands
npm install                         # Install dependencies
npm run dev                         # Start dev server
npm run build                       # Build for production
npm run preview                     # Preview production build
```

## Performance Tips

1. **Image Size** - Reduce image size before upload for faster processing
2. **Database** - Use PostgreSQL in production instead of SQLite
3. **Caching** - Enable Redis for caching predictions
4. **CDN** - Serve static files from CDN
5. **Batch Processing** - Process multiple images in background jobs

## Security Checklist

- [ ] Change SECRET_KEY in .env
- [ ] Set DEBUG=False in production
- [ ] Use HTTPS in production
- [ ] Set ALLOWED_HOSTS properly
- [ ] Configure CORS for production domain only
- [ ] Use environment variables for secrets
- [ ] Validate uploaded image files
- [ ] Set database password securely
- [ ] Use CSRF token in forms
- [ ] Rate limit API endpoints

## Next Steps

1. ✅ Setup complete
2. Test all endpoints
3. Train/optimize your model
4. Deploy to production server
5. Monitor predictions and analytics
6. Gather user feedback
7. Iterate and improve

---

For detailed API documentation, see README.md
