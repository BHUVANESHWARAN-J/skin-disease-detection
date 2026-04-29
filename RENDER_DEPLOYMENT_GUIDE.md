# 🚀 Render Deployment Guide - Complete Setup

This guide covers everything needed to deploy the Skin Disease Detection app to Render.

---

## 📋 Pre-Deployment Checklist

✅ All completed:
- [x] `runtime.txt` - Python 3.10.11 specified
- [x] `requirements.txt` - Moved to root directory
- [x] `render.yaml` - Configured with buildCommand and environment variables
- [x] `build.sh` - Includes migrations and static file collection
- [x] `settings.py` - Environment variables properly configured

---

## 🔧 Step-by-Step Deployment Instructions

### **STEP 1: Generate SECRET_KEY**

You need a secure SECRET_KEY for your production environment.

Run in your local terminal:

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

**Save this key** - you'll need it in Render dashboard.

---

### **STEP 2: Connect GitHub to Render**

1. Go to: **https://dashboard.render.com**
2. Click: **New +** → **Web Service**
3. Click: **Connect GitHub** (if not already connected)
4. Select authorization option:
   - ✅ **Recommended**: "All repositories"
   - ✅ **Or**: "Only select repositories" → select `skin-disease-detection`
5. Click: **Install & Authorize**

---

### **STEP 3: Configure Web Service in Render**

Once GitHub is connected:

1. **Select Repository**: `skin-disease-detection`
2. **Select Branch**: `master` (or `main`)
3. **Name**: `skin-disease-detection` (or your preferred name)
4. **Runtime**: `Python` (should auto-detect)
5. **Build Command**: `bash build.sh` (already in render.yaml)
6. **Start Command**: `cd backend && gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT` (already in render.yaml)

---

### **STEP 4: Set Environment Variables in Render Dashboard**

⚠️ **CRITICAL**: These must be set in Render, not in render.yaml

In the "Environment" section, add:

```
SECRET_KEY = your-generated-secret-key-from-step-1
DEBUG = False
ALLOWED_HOSTS = your-service-name.onrender.com,localhost,127.0.0.1
PYTHON_VERSION = 3.10.11
PORT = 10000
```

**Example values:**
```
SECRET_KEY = django-insecure-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
DEBUG = False
ALLOWED_HOSTS = skin-disease-detection.onrender.com,localhost,127.0.0.1
```

---

### **STEP 5: Deploy**

1. Click: **Create Web Service**
2. Render will:
   - Clone your GitHub repository
   - Install dependencies from `requirements.txt`
   - Run `build.sh` (which runs migrations & collects static files)
   - Start your app with gunicorn

**Deployment usually takes 3-5 minutes**

---

## 🔴 Common Deployment Issues & Fixes

### **Issue 1: 403 Error During Clone**

**Problem**: GitHub permission denied

**Solution**:
1. Go to: https://github.com/settings/installations
2. Click: **Render**
3. Click: **Configure**
4. Under "Repository access":
   - Select **All repositories** (easiest)
   - **OR** add `skin-disease-detection` manually

---

### **Issue 2: Build Fails - "No module named 'django'..."**

**Problem**: Dependencies not installed

**Solution**: Verify `requirements.txt` is in project root (not in `/backend`)
- Current location: ✅ `d:\varshini_project\requirements.txt`
- Wrong location: ❌ `d:\varshini_project\backend\requirements.txt`

---

### **Issue 3: "SECRET_KEY not set"**

**Problem**: Environment variable not configured

**Solution**:
1. In Render dashboard, click your service
2. Go to **Settings** → **Environment**
3. Add: `SECRET_KEY = your-secret-key`
4. Click **Save** and redeploy

---

### **Issue 4: Static Files Not Found (CSS/JS broken)**

**Problem**: WhiteNoise not properly configured

**Solution**: Already fixed in `settings.py`:
```python
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
```

---

### **Issue 5: Database Errors on First Deploy**

**Problem**: Migrations not run

**Solution**: Already fixed in `build.sh`:
```bash
python manage.py migrate --noinput
```

---

## 📊 File Structure Verification

Your deployment structure should be:

```
d:\varshini_project/
├── runtime.txt                    ✅ Python 3.10.11
├── requirements.txt               ✅ All dependencies
├── build.sh                       ✅ Build script with migrations
├── render.yaml                    ✅ Render config
├── Procfile                       (for Heroku, not needed for Render)
├── backend/
│   ├── manage.py
│   ├── backend/
│   │   ├── settings.py           ✅ Updated with env vars
│   │   ├── wsgi.py
│   │   └── urls.py
│   ├── api/
│   ├── ai/
│   └── db.sqlite3
└── frontend/
    ├── src/
    ├── package.json
    └── vite.config.js
```

---

## 🔗 After Deployment

Once deployed successfully:

### **Your app URL:**
```
https://skin-disease-detection.onrender.com
```

### **Important Notes:**
- First deployment: slower (5-10 minutes), subsequent: faster (1-2 minutes)
- Free tier: app spins down after 15 mins of inactivity (5 sec startup delay)
- Paid tier: always running
- Database: SQLite (ephemeral) - data lost on redeploy
  - For production: upgrade to PostgreSQL in Render

### **Monitor Deployment:**
1. Click your service in Render dashboard
2. Go to **Logs** tab
3. Watch real-time deployment logs

### **Test Your API:**
```bash
curl https://skin-disease-detection.onrender.com/api/status
```

---

## ⚠️ Production Security Recommendations

Before going to production:

1. **Change ALLOWED_HOSTS** to your actual domain only:
   ```python
   ALLOWED_HOSTS = ["your-domain.com"]
   ```

2. **Use PostgreSQL** instead of SQLite:
   - Add PostgreSQL database in Render
   - Update `settings.py` with DB credentials

3. **Change SECRET_KEY** to a new strong key

4. **Set DEBUG = False** (already done)

5. **Use environment variables** for sensitive data (already configured)

---

## 📞 Getting Help

If deployment fails:

1. Check **Render Logs**: Click service → **Logs** tab
2. Common errors:
   - `ModuleNotFoundError`: dependency missing from requirements.txt
   - `CommandError: SECRET_KEY`: env var not set
   - `db.sqlite3: permission denied`: migrations need to run
   - `static files not found`: collectstatic failed

3. Re-run build: Click **Manual Redeploy** in Render dashboard

---

## ✅ Deployment Checklist - Ready to Deploy?

- [ ] Generated SECRET_KEY
- [ ] Connected GitHub to Render
- [ ] Selected repository and branch
- [ ] Set all environment variables in Render dashboard
- [ ] Verified `requirements.txt` is in root directory
- [ ] Verified `runtime.txt` has `python-3.10.11`
- [ ] Reviewed `render.yaml` configuration
- [ ] Latest code pushed to GitHub

**If all checked ✅ → Ready to deploy!**

---

**Created**: 2026-04-29  
**Status**: Ready for production deployment
