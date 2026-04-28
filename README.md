# Skin AI Detection - Complete Full Stack Medical AI Platform

A professional medical-grade skin disease detection system using React, Django, TensorFlow, and Explainable AI with Grad-CAM heatmaps.

## 🎯 Features

✅ **AI Prediction** - Real-time skin disease classification with confidence scores
✅ **Explainable AI** - Grad-CAM heatmaps showing model decision regions
✅ **Medical Severity Assessment** - Automatic disease severity and priority classification
✅ **Treatment Recommendations** - AI-powered treatment suggestions based on disease
✅ **Professional UI** - Modern medical-grade Tailwind CSS design
✅ **User Authentication** - JWT-based secure authentication
✅ **Admin Dashboard** - Analytics with disease distribution charts
✅ **Prediction History** - Track all user predictions with detailed records
✅ **Responsive Design** - Mobile-friendly interface

## 📁 Project Structure

```
skin-ai-project/
├── backend/                  # Django REST API + TensorFlow
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env                  # Environment variables
│   ├── backend/
│   │   ├── settings.py       # Django config
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── api/                  # REST API app
│   │   ├── models.py         # PredictionHistory model
│   │   ├── views.py          # API endpoints
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   ├── permissions.py
│   │   └── admin.py
│   ├── ai/                   # AI Engine
│   │   ├── model_loader.py   # Load Keras model
│   │   ├── preprocess.py     # Image preprocessing
│   │   ├── predict.py        # Main prediction pipeline
│   │   ├── gradcam.py        # Grad-CAM heatmap generation
│   │   ├── severity.py       # Disease severity rules
│   │   └── treatment.py      # Treatment recommendations
│   └── model/
│       ├── best_skin_model.keras
│       └── label_encoder.pkl
│
└── frontend/                 # React + Vite + Tailwind
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    └── src/
        ├── pages/
        │   ├── Home.jsx         # Landing page
        │   ├── Login.jsx        # User login
        │   ├── Register.jsx     # User registration
        │   ├── Upload.jsx       # Image upload interface
        │   ├── Result.jsx       # Prediction results with heatmap
        │   ├── History.jsx      # User prediction history
        │   └── Dashboard.jsx    # Admin analytics dashboard
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   └── ProtectedRoute.jsx
        ├── services/
        │   ├── api.js           # Axios instance with JWT
        │   └── auth.js          # Auth service methods
        ├── context/
        │   └── AuthContext.jsx  # Global auth state
        ├── App.jsx
        ├── main.jsx
        └── index.css
```

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+
- npm/yarn
- Your trained Keras model and label encoder

### Backend Setup

1. **Install Python dependencies:**
```bash
cd backend
pip install -r requirements.txt
```

2. **Configure environment variables:**
```bash
# Create backend/.env file
SECRET_KEY=your-secret-key-here
DEBUG=True
```

3. **Add your model files:**
```bash
# Place these in backend/model/
backend/model/best_skin_model.keras
backend/model/label_encoder.pkl
```

4. **Run migrations:**
```bash
python manage.py makemigrations
python manage.py migrate
```

5. **Create superuser (optional):**
```bash
python manage.py createsuperuser
```

6. **Start backend server:**
```bash
python manage.py runserver
```

Backend runs on: `http://127.0.0.1:8000`

### Frontend Setup

1. **Install dependencies:**
```bash
cd frontend
npm install
```

2. **Start development server:**
```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

## 📡 API Endpoints

| Method | Endpoint         | Auth | Purpose |
| ------ | ---------------- | ---- | ------- |
| POST   | `/api/register/` | ❌   | Create new user |
| POST   | `/api/login/`    | ❌   | Get JWT token |
| GET    | `/api/profile/`  | ✅   | Get user profile |
| GET    | `/api/history/`  | ✅   | Get prediction history |
| POST   | `/api/predict/`  | ✅   | Upload image & predict |
| GET    | `/api/dashboard/`| ✅   | Get admin analytics |

## 🔄 Complete User Flow

```
1. User registers with username/email/password
   ↓
2. User logs in → Gets JWT token
   ↓
3. User uploads skin image
   ↓
4. Backend processes with TensorFlow model
   ↓
5. Grad-CAM generates heatmap showing model focus areas
   ↓
6. Results displayed with:
   - Predicted disease
   - Confidence score with progress bar
   - Severity level (High/Moderate/Low)
   - Medical priority (Immediate/Within 3 Days/Routine)
   - Treatment recommendations
   - AI heatmap visualization
   ↓
7. Prediction saved to user history
   ↓
8. Admin can view dashboard with analytics:
   - Total predictions count
   - Disease distribution chart
   - Recent predictions table
```

## 🎨 UI Components

### Professional Design Features
- **Tailwind CSS** - Utility-first styling
- **Responsive Grid Layout** - Works on all devices
- **Medical Color Scheme** - Blue/green for healthcare
- **Progress Bars** - Visual confidence indicators
- **Status Badges** - Severity level indicators
- **Data Tables** - Professional history display
- **Charts** - Disease distribution with Chart.js
- **Heatmap Display** - AI decision visualization

### Page Descriptions

**Home** - Landing page with call-to-action
**Register** - New user registration form
**Login** - Authentication with JWT
**Upload** - Drag-and-drop image upload interface
**Result** - Prediction display with heatmap
**History** - Table of all user's predictions
**Dashboard** - Admin analytics and monitoring

## 🤖 AI Features

### Grad-CAM Heatmap
- Shows which regions of the skin image the model focused on
- Uses gradient-weighted class activation mapping
- Saves heatmap as jet-colored visualization
- Helps explain model predictions (explainable AI)

### Disease Classification
Supports 8 skin disease classes:
- MEL (Melanoma) - High severity
- SCC (Squamous Cell Carcinoma) - High severity
- BCC (Basal Cell Carcinoma) - Moderate
- AK (Actinic Keratosis) - Moderate
- NV (Benign Nevus) - Low
- BKL (Benign Keratosis) - Low
- DF (Dermatofibroma) - Low
- VASC (Vascular Lesion) - Low

### Severity Assessment
Automatic priority classification:
- **High** → Immediate (MEL, SCC)
- **Moderate** → Within 3 Days (BCC, AK)
- **Low** → Routine (NV, BKL, DF, VASC)

## 🔐 Security

- JWT authentication for all protected routes
- CORS enabled for frontend
- Password hashing with Django
- Protected API endpoints require valid token
- Secure image upload handling

## 📊 Database Models

### PredictionHistory
```python
- user: ForeignKey(User)
- image: ImageField
- heatmap: ImageField
- predicted_disease: CharField
- confidence: FloatField
- severity: CharField
- doctor_priority: CharField
- created_at: DateTimeField
```

## 🛠 Tech Stack

**Backend:**
- Django 5.0.6 - Web framework
- Django REST Framework - API building
- TensorFlow 2.16.1 - Deep learning
- NumPy - Numerical computing
- Pillow - Image processing
- OpenCV - Computer vision
- JWT - Authentication

**Frontend:**
- React 18.2 - UI library
- Vite - Build tool
- React Router - Navigation
- Axios - HTTP client
- Tailwind CSS - Styling
- Chart.js - Data visualization

## 📝 Model Requirements

Your Keras model should:
- Accept 224x224 RGB images
- Return softmax probabilities for 8 classes
- Work with EfficientNetB3 architecture (recommended)

Label encoder should map indices to disease names:
```python
0: "MEL"
1: "BCC"
2: "AK"
3: "SCC"
4: "NV"
5: "BKL"
6: "DF"
7: "VASC"
```

## 🚨 Troubleshooting

**Model loading error:**
- Check model path is `backend/model/best_skin_model.keras`
- Verify label encoder pickle file exists

**CORS errors:**
- Ensure frontend URL matches Django CORS settings
- Check `CORS_ALLOW_ALL_ORIGINS = True` in settings.py

**Image upload fails:**
- Check media folder permissions
- Verify `backend/media/uploads/` exists

**Dashboard shows no data:**
- Check if predictions exist in database
- Verify dashboard API endpoint is working

## 📈 Deployment Considerations

**For Production:**
1. Set `DEBUG=False` in .env
2. Use PostgreSQL instead of SQLite
3. Add proper SECRET_KEY
4. Configure static files serving
5. Use HTTPS
6. Add ALLOWED_HOSTS
7. Deploy frontend with `npm run build`
8. Use gunicorn/uWSGI for Django
9. Set up Redis for caching
10. Configure CDN for media files

## 📚 API Response Examples

**Login Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Prediction Response:**
```json
{
  "disease": "BCC",
  "confidence": 94.2,
  "severity": "Moderate",
  "doctor_priority": "Within 3 Days",
  "treatment": [
    "Consult dermatologist in 3 days",
    "Cryotherapy may help",
    "Avoid sun exposure"
  ],
  "heatmap_url": "/media/heatmaps/1234567890.jpg"
}
```

**Dashboard Response:**
```json
{
  "total_predictions": 245,
  "top_diseases": [
    {"predicted_disease": "BCC", "count": 85},
    {"predicted_disease": "MEL", "count": 62}
  ],
  "recent": [...]
}
```

## 🎓 Educational Use

This project demonstrates:
- Full-stack web development
- Deep learning model integration
- REST API design
- Authentication & authorization
- Explainable AI techniques
- Medical AI applications
- Professional UI/UX design

## 📄 License

MIT License - Feel free to use for educational and commercial projects

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📧 Support

For issues or questions:
- Check documentation above
- Review code comments
- Check Django/React official docs

---

**Built with ❤️ for medical AI**
