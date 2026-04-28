# Technical Implementation Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                     │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Pages: Home, Login, Register, Upload, Result    │   │
│  │ History, Dashboard                              │   │
│  └─────────────────┬────────────────────────────────┘   │
└────────────────────┼──────────────────────────────────────┘
                     │ HTTP/REST with JWT
                     ↓
┌─────────────────────────────────────────────────────────┐
│          Backend (Django REST API)                      │
│  ┌──────────────────────────────────────────────────┐   │
│  │ API Views: Register, Login, Predict, History    │   │
│  │ Dashboard (Analytics)                           │   │
│  └─────────────────┬────────────────────────────────┘   │
│                    │                                     │
│  ┌────────────────┴─────────────────────────────────┐   │
│  │         AI Engine (TensorFlow)                   │   │
│  │  • Model Loading                                 │   │
│  │  • Image Preprocessing (224x224 resize)         │   │
│  │  • Prediction (Softmax probabilities)            │   │
│  │  • Grad-CAM Heatmap Generation                   │   │
│  │  • Severity & Treatment Classification           │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                     │
                     ↓
         ┌──────────────────────────┐
         │ SQLite/PostgreSQL DB     │
         │ PredictionHistory model  │
         └──────────────────────────┘
```

## Backend Components

### 1. Django Settings Configuration

**Location:** `backend/backend/settings.py`

Key configurations:
- `INSTALLED_APPS` - Includes api app, rest_framework, corsheaders
- `MIDDLEWARE` - CORS middleware first for proper header handling
- `DATABASES` - SQLite for development, PostgreSQL for production
- `REST_FRAMEWORK` - JWT authentication configured
- `CORS_ALLOW_ALL_ORIGINS = True` - Allow frontend requests
- `MEDIA_ROOT/MEDIA_URL` - Store uploaded images and heatmaps

### 2. Database Models

**Location:** `backend/api/models.py`

```python
class PredictionHistory(models.Model):
    user: ForeignKey(User)      # Link to user
    image: ImageField           # Original uploaded image
    heatmap: ImageField         # Grad-CAM visualization
    predicted_disease: CharField # Disease classification
    confidence: FloatField      # Model confidence (0-100)
    severity: CharField         # High/Moderate/Low
    doctor_priority: CharField  # Immediate/Within 3 Days/Routine
    created_at: DateTimeField   # Timestamp
```

### 3. API Endpoints Implementation

**Location:** `backend/api/views.py`

#### RegisterView
- Method: POST `/api/register/`
- Input: username, email, password
- Output: User created message
- Auth: AllowAny

#### LoginView (from SimplJWT)
- Method: POST `/api/login/`
- Input: username, password
- Output: access token, refresh token
- Auth: AllowAny

#### ProfileView
- Method: GET `/api/profile/`
- Output: Current user's username and email
- Auth: IsAuthenticated

#### HistoryView
- Method: GET `/api/history/`
- Output: All user's predictions sorted by date
- Filter: By current user
- Auth: IsAuthenticated

#### PredictView
- Method: POST `/api/predict/`
- Input: image file (multipart form data)
- Process:
  1. Preprocess image (224x224, normalize)
  2. Run TensorFlow model prediction
  3. Generate Grad-CAM heatmap
  4. Calculate disease severity
  5. Get treatment recommendations
  6. Save to database
- Output: Prediction result with heatmap URL
- Auth: IsAuthenticated

#### DashboardView
- Method: GET `/api/dashboard/`
- Output:
  - Total predictions count
  - Top 5 diseases with counts
  - 5 most recent predictions
- Auth: IsAuthenticated

### 4. AI Engine Implementation

#### Model Loader (`ai/model_loader.py`)
```python
# Loads model and label encoder at startup
model = tf.keras.models.load_model(MODEL_PATH)
label_encoder = pickle.load(ENCODER_PATH)
```

#### Image Preprocessing (`ai/preprocess.py`)
```python
def preprocess_image(file_obj):
    # 1. Open image and convert to RGB
    image = Image.open(file_obj).convert("RGB")
    
    # 2. Resize to 224x224 (EfficientNetB3 input size)
    image = image.resize((224, 224))
    
    # 3. Convert to numpy array and normalize
    arr = np.array(image).astype("float32")
    arr = tf.keras.applications.efficientnet.preprocess_input(arr)
    
    # 4. Add batch dimension [1, 224, 224, 3]
    arr = np.expand_dims(arr, axis=0)
    
    return arr
```

#### Prediction Pipeline (`ai/predict.py`)
```python
def run_prediction(file, user):
    # 1. Preprocess image
    x = preprocess_image(file)
    
    # 2. Get model predictions
    pred = model.predict(x, verbose=0)[0]  # [conf_class0, conf_class1, ...]
    
    # 3. Find highest probability
    index = pred.argmax()
    confidence = float(pred[index]) * 100
    
    # 4. Decode disease name using label encoder
    disease = label_encoder.inverse_transform([index])[0]
    
    # 5. Get severity level and medical priority
    severity, priority = get_severity(disease)
    
    # 6. Get treatment recommendations
    treatment = get_treatment(disease)
    
    # 7. Generate Grad-CAM heatmap
    heatmap_url = generate_heatmap(model, x, f"{int(time.time())}.jpg")
    
    # 8. Save to database
    history = PredictionHistory.objects.create(...)
    
    # 9. Return results
    return {
        "disease": disease,
        "confidence": round(confidence, 2),
        "severity": severity,
        "doctor_priority": priority,
        "treatment": treatment,
        "heatmap_url": heatmap_url
    }
```

#### Grad-CAM Heatmap (`ai/gradcam.py`)

Grad-CAM (Gradient-weighted Class Activation Mapping) explains model decisions:

```python
def generate_heatmap(model, img_array, save_name):
    # 1. Find last convolutional layer
    for layer in reversed(model.layers):
        if len(layer.output.shape) == 4:
            last_conv_layer = layer.name
            break
    
    # 2. Create gradient model
    grad_model = tf.keras.models.Model(
        [model.inputs],
        [model.get_layer(last_conv_layer).output, model.output]
    )
    
    # 3. Calculate gradients
    with tf.GradientTape() as tape:
        conv_outputs, predictions = grad_model(img_array)
        pred_index = tf.argmax(predictions[0])
        loss = predictions[:, pred_index]
    
    grads = tape.gradient(loss, conv_outputs)
    
    # 4. Weight gradients by convolution outputs
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
    heatmap = conv_outputs[0] @ pooled_grads[..., tf.newaxis]
    
    # 5. Normalize and colorize
    heatmap = np.maximum(heatmap, 0) / np.max(heatmap)
    heatmap = cv2.resize(heatmap.numpy(), (224, 224))
    heatmap = np.uint8(255 * heatmap)
    heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
    
    # 6. Save and return URL
    cv2.imwrite(str(path), heatmap)
    return f"/media/heatmaps/{save_name}"
```

#### Disease Severity (`ai/severity.py`)
```python
def get_severity(disease):
    # Map disease to severity level and medical priority
    high = ["MEL", "SCC"]        # Immediate action needed
    medium = ["BCC", "AK"]        # Within 3 days
    low = ["NV", "BKL", "DF", "VASC"]  # Routine review
    
    return severity, priority
```

#### Treatment Rules (`ai/treatment.py`)
```python
def get_treatment(disease):
    # Rule-based treatment recommendations
    rules = {
        "MEL": ["Urgent dermatologist consultation", ...],
        "BCC": ["Consult dermatologist in 3 days", ...],
        # ... more diseases
    }
    return rules.get(disease, ["Consult doctor"])
```

## Frontend Components

### 1. Authentication Flow

**AuthContext.jsx** - Global state management:
```javascript
export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Check localStorage for existing token
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) setUser({ token });
        setLoading(false);
    }, []);
    
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };
    
    return (
        <AuthContext.Provider value={{ user, logout, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
```

### 2. API Service Layer

**services/api.js** - Axios configuration:
```javascript
const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/"
});

// Add JWT token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
```

**services/auth.js** - API methods:
```javascript
export const authService = {
    register: (username, email, password) => 
        api.post("register/", { username, email, password }),
    
    login: (username, password) => 
        api.post("login/", { username, password }),
    
    predict: (file) => {
        const formData = new FormData();
        formData.append("image", file);
        return api.post("predict/", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
    },
    
    getHistory: () => api.get("history/"),
    getDashboard: () => api.get("dashboard/")
};
```

### 3. Protected Routes

**ProtectedRoute.jsx** - Route guard:
```javascript
export function ProtectedRoute({ children }) {
    const { user, loading } = useContext(AuthContext);
    
    if (loading) return <h2>Loading...</h2>;
    
    // Redirect to login if not authenticated
    return user ? children : <Navigate to="/login" />;
}
```

### 4. Page Components

**Upload.jsx** - Image upload handling:
```javascript
const submit = async () => {
    const formData = new FormData();
    formData.append("image", file);
    
    const res = await api.post("predict/", formData);
    localStorage.setItem("result", JSON.stringify(res.data));
    navigate("/result");
};
```

**Result.jsx** - Display prediction with heatmap:
```javascript
<img
    src={`http://127.0.0.1:8000${data.heatmap_url}`}
    alt="AI Heatmap"
    className="w-full rounded-lg"
/>
```

**Dashboard.jsx** - Analytics with Chart.js:
```javascript
const pieData = {
    labels: data.top_diseases.map(x => x.predicted_disease),
    datasets: [{
        data: data.top_diseases.map(x => x.count),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', ...]
    }]
};

<Pie data={pieData} options={{ responsive: true }} />
```

### 5. Styling with Tailwind CSS

Utility-first CSS framework applied throughout:
- `bg-blue-700` - Background colors
- `text-2xl font-bold` - Typography
- `px-6 py-4` - Padding
- `rounded-xl` - Border radius
- `shadow-lg` - Box shadows
- `grid grid-cols-3` - Grid layout
- `flex justify-between` - Flexbox
- `hover:bg-blue-700` - Hover states
- `transition` - Smooth animations

## Data Flow Diagrams

### Registration Flow
```
User Input (Register.jsx)
    ↓
Validation
    ↓
POST /api/register/
    ↓
Django: RegisterSerializer.create()
    ↓
User.objects.create_user()
    ↓
Response: "User created"
    ↓
Navigate to /login
```

### Prediction Flow
```
User selects image (Upload.jsx)
    ↓
Click "Analyze Image"
    ↓
POST /api/predict/ with FormData
    ↓
Backend receives file
    ↓
preprocess_image() - Resize to 224x224
    ↓
model.predict() - TensorFlow inference
    ↓
generate_heatmap() - Grad-CAM visualization
    ↓
get_severity() - Disease severity
    ↓
get_treatment() - Treatment rules
    ↓
PredictionHistory.objects.create() - Save to DB
    ↓
Return JSON response with heatmap_url
    ↓
localStorage.setItem("result", ...)
    ↓
Navigate to /result
    ↓
Result page displays all data + heatmap
```

### Authentication Token Flow
```
POST /api/login/ (username, password)
    ↓
SimplJWT creates tokens:
  - access: short-lived (5 min)
  - refresh: long-lived (24h)
    ↓
Frontend stores access in localStorage
    ↓
Every request includes:
  Authorization: Bearer access_token
    ↓
Django middleware verifies token
    ↓
If valid: request.user is set
If invalid: 401 Unauthorized response
    ↓
Frontend catches 401 and redirects to /login
```

## Performance Optimizations

1. **Image Preprocessing**
   - Resize to 224x224 before sending to model
   - Reduces computation time
   - Memory efficient

2. **Batch Predictions**
   - Can be implemented for multiple images
   - Use background tasks (Celery)

3. **Caching**
   - Cache top diseases on dashboard
   - Redis for session storage

4. **Database Indexes**
   - Index on user_id for faster history queries
   - Index on created_at for timeline queries

5. **Frontend Optimization**
   - Code splitting with React.lazy()
   - Image lazy loading
   - Minification with Vite

## Security Implementation

1. **Authentication**
   - JWT tokens with expiration
   - Secure token storage in localStorage
   - Refresh token rotation

2. **Authorization**
   - IsAuthenticated permission class
   - Users can only see own predictions
   - CSRF protection

3. **Input Validation**
   - File type validation (image only)
   - File size limits
   - Serializer validation

4. **Data Protection**
   - Password hashing with Django
   - HTTPS in production
   - CORS for origin validation

## Deployment Considerations

1. **Backend Deployment**
   - Use PostgreSQL (not SQLite)
   - Run with gunicorn/uWSGI
   - Configure reverse proxy (nginx)
   - Set DEBUG=False
   - Use environment variables for secrets

2. **Frontend Deployment**
   - Build with `npm run build`
   - Serve from CDN or static server
   - Set correct API_URL for backend
   - Enable gzip compression

3. **Infrastructure**
   - Use Docker for containerization
   - Kubernetes for orchestration
   - AWS/Azure/GCP for hosting
   - RDS for database
   - S3/Blob storage for media files

---

**For more details, refer to README.md and SETUP_GUIDE.md**
