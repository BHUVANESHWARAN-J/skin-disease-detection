# 🚀 RENDER DEPLOYMENT - COMPLETE STEP-BY-STEP GUIDE FROM SCRATCH

**Goal**: Deploy Skin Disease Detection App to Render in 15 minutes

---

## ✅ **PRE-DEPLOYMENT CHECKLIST (Before Starting)**

Verify these files exist and are correct:

- [ ] `runtime.txt` - contains: `python-3.10.11`
- [ ] `requirements.txt` - in root directory (not in backend/)
- [ ] `render.yaml` - configured with buildCommand
- [ ] `build.sh` - runs migrations and collects static files
- [ ] `backend/backend/settings.py` - uses environment variables
- [ ] Code pushed to GitHub repository

**Status**: ✅ All verified and fixed

---

---

# 📋 STEP-BY-STEP DEPLOYMENT PROCESS

## **PHASE 1: PREPARE YOUR MACHINE (5 minutes)**

### **Step 1.1: Generate SECRET_KEY**

Open PowerShell and run:

```powershell
cd d:\varshini_project
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

**Output will look like:**
```
django-insecure-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z
```

✅ **SAVE THIS KEY SOMEWHERE SAFE** - You'll need it in a few minutes

---

### **Step 1.2: Verify All Files Are Committed to Git**

```powershell
cd d:\varshini_project
git status
```

**You should see:**
```
On branch master
Your branch is up to date with 'origin/master'.

nothing to commit, working tree clean
```

✅ If you see uncommitted changes, run:
```powershell
git add .
git commit -m "Final deployment preparation"
git push
```

---

### **Step 1.3: Verify GitHub Repository**

1. Open: https://github.com (login if needed)
2. Go to your `skin-disease-detection` repository
3. Verify you can see:
   - Latest commits are there
   - `render.yaml` file exists
   - `requirements.txt` in root directory
   - `build.sh` file exists

✅ All files visible on GitHub

---

---

## **PHASE 2: RENDER SETUP (3 minutes)**

### **Step 2.1: Create Render Account** (skip if you have one)

1. Go to: https://render.com
2. Click **Sign Up**
3. Choose: **Sign up with GitHub** (easiest)
4. Click **Authorize render-oss**
5. Complete signup

✅ You now have a Render account

---

### **Step 2.2: Go to Render Dashboard**

After signing up/logging in:

1. Go to: https://dashboard.render.com
2. You should see: **"Services"** section (may be empty)

✅ Render dashboard is ready

---

---

## **PHASE 3: CONNECT GITHUB TO RENDER (2 minutes)**

### **Step 3.1: Link Your GitHub Account**

In Render Dashboard:

1. Click your **Account** icon (top right)
2. Go to **Account Settings**
3. Scroll to **Connected Services**
4. Click **Connect GitHub**

You'll be redirected to GitHub.

---

### **Step 3.2: Authorize Render**

On GitHub authorization page:

1. Review permissions (Render needs access to your repos)
2. Choose repository access:
   
   **Option A (Recommended for beginners):**
   ```
   ✅ All repositories
   ```
   
   **Option B (More secure):**
   ```
   ✅ Only select repositories → Choose: skin-disease-detection
   ```

3. Click **Install & Authorize**

✅ GitHub is now connected to Render

---

---

## **PHASE 4: CREATE WEB SERVICE (5 minutes)**

### **Step 4.1: Start New Web Service**

Back in Render Dashboard:

1. Click **New +** button (top right)
2. Select **Web Service**

You should see: **"Connect a repository"** section

---

### **Step 4.2: Select Your GitHub Repository**

You'll see a list of repositories:

1. Search for or find: **skin-disease-detection**
2. Click **Connect** next to it

---

### **Step 4.3: Configure Basic Settings**

Fill in the form:

```
Name:           skin-disease-detection
Root Directory: (leave empty)
Environment:    Python
Region:         Choose closest to your users
Branch:         master
```

**Leave other settings as default** (render.yaml will auto-configure)

---

### **Step 4.4: Create Service**

Click the **Create Web Service** button

You'll be taken to service page showing:
```
Status: Queued
```

**This means Render is preparing to deploy. DO NOT CLOSE THIS PAGE.**

---

---

## **PHASE 5: CONFIGURE ENVIRONMENT VARIABLES (2 minutes)**

### **Step 5.1: Wait for Service Page to Load**

Wait 10-15 seconds. You should see:

```
Service Page
├── Logs (showing deployment progress)
├── Settings
├── Environment
└── ...
```

---

### **Step 5.2: Go to Environment Variables**

1. In the service page, click **Environment** tab
2. Click **Add Environment Variable**

---

### **Step 5.3: Add SECRET_KEY**

First variable:

```
KEY:    SECRET_KEY
VALUE:  (paste the key you generated in Step 1.1)
```

Click **Save**

✅ SECRET_KEY added

---

### **Step 5.4: Add DEBUG Variable**

Second variable:

```
KEY:    DEBUG
VALUE:  False
```

Click **Save**

✅ DEBUG set to False (production mode)

---

### **Step 5.5: Add ALLOWED_HOSTS**

Third variable:

```
KEY:    ALLOWED_HOSTS
VALUE:  skin-disease-detection.onrender.com,localhost,127.0.0.1
```

Click **Save**

✅ ALLOWED_HOSTS configured

---

### **Step 5.6: Verify All Variables Are Set**

You should now see in Environment section:

```
✅ SECRET_KEY = django-insecure-...
✅ DEBUG = False
✅ ALLOWED_HOSTS = skin-disease-detection.onrender.com,localhost,127.0.0.1
✅ PYTHON_VERSION = 3.10.11 (from render.yaml)
✅ PORT = 10000 (from render.yaml)
```

✅ All environment variables are set

---

---

## **PHASE 6: MONITOR DEPLOYMENT (5 minutes)**

### **Step 6.1: Watch the Logs**

1. Go back to service page
2. Click **Logs** tab
3. You should see deployment progress:

```
=== Deployment Starting ===
Cloning repository...
Building app...
Running build.sh...
python manage.py migrate...
python manage.py collectstatic...
Starting gunicorn...
=== Deployment Complete ===
```

**Common messages you'll see:**

```
✅ "Running on https://skin-disease-detection.onrender.com"
```

This means deployment is successful!

---

### **Step 6.2: Check Service Status**

At the top of the page, you should see:

```
Status: Live 🟢
```

If you see:

```
Status: Building 🔵
```

Wait a few more minutes. If you see:

```
Status: Failed 🔴
```

Scroll down in Logs to see the error message.

---

### **Step 6.3: Get Your Live URL**

At the top of the page:

```
skin-disease-detection.onrender.com
```

✅ This is your live app URL!

---

---

## **PHASE 7: TEST YOUR DEPLOYMENT (2 minutes)**

### **Step 7.1: Test Backend API**

Open a new browser tab:

```
https://skin-disease-detection.onrender.com/api/
```

You should see:
```
Django REST Framework API page
```

If you see this, backend is working ✅

---

### **Step 7.2: Test a Specific Endpoint**

Try:

```
https://skin-disease-detection.onrender.com/api/status
```

or

```
https://skin-disease-detection.onrender.com/api/predict
```

(depends on your API endpoints)

✅ API is responding

---

### **Step 7.3: Check Logs for Errors**

Go back to Render dashboard:

1. Click **Logs** tab
2. Look for any error messages
3. Common errors:
   - **ModuleNotFoundError**: dependency missing
   - **CommandError**: environment variable missing
   - **Connection refused**: port not configured

If you see errors, go to **TROUBLESHOOTING** section below.

---

---

## **PHASE 8: CONFIGURE FRONTEND (Optional)**

If you want to deploy frontend too:

### **Option 1: Deploy Frontend Separately**

1. Create another Render service
2. Type: **Static Site** (not Web Service)
3. Root directory: `frontend`
4. Build command: `npm run build`
5. Publish directory: `dist`

### **Option 2: Update Frontend API URL**

If frontend is deployed separately:

1. Go to `frontend/src/services/api.js`
2. Change:
   ```javascript
   // From
   const API_BASE = "http://localhost:8000"
   
   // To
   const API_BASE = "https://skin-disease-detection.onrender.com"
   ```

3. Rebuild frontend
4. Push to GitHub

---

---

## **🎓 TROUBLESHOOTING**

### **Problem 1: Deployment Shows "Failed"**

**Step 1**: Click **Logs** tab

**Step 2**: Look for error messages. Common ones:

#### Error: "ModuleNotFoundError: No module named 'django'"
```
Cause: requirements.txt not found
Solution: 
- Verify requirements.txt is in ROOT directory
- Not in backend/requirements.txt
- Redeploy: Click "Manual Redeploy" in Render dashboard
```

#### Error: "SECRET_KEY not provided"
```
Cause: Environment variable not set
Solution:
1. Go to Environment tab
2. Add: SECRET_KEY = your-generated-key
3. Click "Manual Redeploy"
```

#### Error: "SyntaxError in settings.py"
```
Cause: Python syntax error
Solution:
1. Check your settings.py file
2. Fix the error locally
3. Git push
4. Redeploy
```

#### Error: "No such option: --dry-run"
```
This is NOT an error - ignore it
It's just a failed pip check command
Your app will still run
```

---

### **Problem 2: App Shows "Not Available"**

**This usually means:**
- App is still building (wait 5 minutes)
- Database migrations failed
- Static files not collected

**Solution:**
1. Wait 10 minutes
2. Click "Manual Redeploy" in Render dashboard
3. Check logs for specific errors

---

### **Problem 3: 403 Error When Connecting GitHub**

**Cause**: Render doesn't have permission to access repository

**Solution**:
1. Go to: https://github.com/settings/installations
2. Click **Render**
3. Click **Configure**
4. Select **All repositories** (or add your repo manually)
5. Go back to Render
6. Click "Manual Redeploy"

---

### **Problem 4: Static Files Not Found (CSS/JS Broken)**

**Cause**: collectstatic didn't run

**Solution**:
1. Check build.sh runs collectstatic
2. Verify WhiteNoise is installed (in requirements.txt)
3. Click "Manual Redeploy"

---

### **Problem 5: Database Errors**

**Cause**: Migrations didn't run

**Solution**:
1. Check build.sh includes: `python manage.py migrate --noinput`
2. Verify database backend is sqlite3 (default)
3. Click "Manual Redeploy"

---

---

## **✅ SUCCESS CHECKLIST**

After deployment completes, verify:

- [ ] Service shows "Live" (green status)
- [ ] URL is accessible: https://skin-disease-detection.onrender.com
- [ ] Backend API responds: /api/
- [ ] No error messages in logs
- [ ] Environment variables are set
- [ ] Can access an API endpoint

If all checked ✅ → **Deployment is successful!**

---

---

## **📊 MONITORING YOUR LIVE APP**

### **Daily Monitoring**

1. Check Render dashboard regularly
2. Monitor logs for errors
3. Check application performance

---

### **If App Stops Working**

1. Go to Render dashboard
2. Go to service Logs tab
3. Look for error messages
4. Common issues:
   - Out of memory (upgrade plan)
   - Database full (clean up data)
   - Dependency error (update requirements.txt)

---

### **Manual Redeploy (if needed)**

If something goes wrong:

1. Render dashboard → Your service
2. Click three dots menu (...)
3. Click **Manual Redeploy**
4. Render will restart the app

---

---

## **🎉 YOU'RE DEPLOYED!**

Your app is now live on the internet! 

### **Share your URL:**
```
https://skin-disease-detection.onrender.com
```

### **Next Steps (Optional):**
- Add custom domain
- Set up monitoring/alerts
- Deploy frontend
- Add database (PostgreSQL)
- Enable HTTPS (automatic)

---

**Status**: ✅ Ready to deploy  
**Time needed**: 15-20 minutes  
**All files**: Pre-configured and committed

---

## **QUICK REFERENCE - Commands**

```powershell
# Generate SECRET_KEY
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

# Check Git status
git status

# Commit and push
git add .
git commit -m "message"
git push

# View git log
git log --oneline -5
```

---

**Start with Step 1.1 and follow each step in order. You'll have a live app in 15 minutes!**
