# 🚀 RENDER DEPLOYMENT - QUICK START (2 PAGE SUMMARY)

---

## 📋 PHASE 1: PREPARE (5 MIN)

### 1️⃣ Generate SECRET_KEY
```powershell
cd d:\varshini_project
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```
**Save the output** → you'll need it later

### 2️⃣ Push Code to GitHub
```powershell
git status                    # verify nothing uncommitted
git push                      # push to GitHub
```

### 3️⃣ Verify on GitHub
- Go to: https://github.com/your-username/skin-disease-detection
- See `requirements.txt` in root? ✅
- See `render.yaml` file? ✅
- See `build.sh` file? ✅

---

## 📱 PHASE 2: RENDER SETUP (3 MIN)

### 1️⃣ Create Account
- Go to: https://render.com
- Click **Sign Up**
- **Sign up with GitHub** (easiest)

### 2️⃣ Go to Dashboard
- After signup, go to: https://dashboard.render.com

---

## 🔗 PHASE 3: CONNECT GITHUB (2 MIN)

### 1️⃣ Link GitHub Account
1. Click **Account** (top right)
2. Go to **Account Settings**
3. Find **Connected Services**
4. Click **Connect GitHub**
5. Authorize with GitHub

### 2️⃣ Grant Repository Access
Choose one:
- ✅ **All repositories** (easiest)
- OR
- ✅ **Only select repositories** → pick `skin-disease-detection`

---

## ⚙️ PHASE 4: CREATE SERVICE (5 MIN)

### 1️⃣ Start New Service
1. In Render dashboard, click **New +**
2. Select **Web Service**

### 2️⃣ Connect Repository
1. Find **skin-disease-detection**
2. Click **Connect**

### 3️⃣ Configure Service
```
Name:      skin-disease-detection
Branch:    master
Region:    (choose closest to you)
```

Click **Create Web Service**

✅ **DO NOT CLOSE THIS PAGE** - service is building

---

## 🔐 PHASE 5: ADD ENVIRONMENT VARIABLES (2 MIN)

**Wait for service page to fully load**

### 1️⃣ Go to Environment Tab
Click **Environment** in the service page

### 2️⃣ Add Variables (click Add for each)

| KEY | VALUE |
|-----|-------|
| `SECRET_KEY` | `your-generated-key-from-step-1` |
| `DEBUG` | `False` |
| `ALLOWED_HOSTS` | `skin-disease-detection.onrender.com,localhost,127.0.0.1` |

**Note**: `PYTHON_VERSION` and `PORT` are already set in render.yaml

---

## 📊 PHASE 6: MONITOR DEPLOYMENT (5 MIN)

### 1️⃣ Check Logs
1. Click **Logs** tab
2. Watch deployment progress
3. Should end with: **"Running on..."**

### 2️⃣ Wait for Status
Service status should change from:
```
🔵 Building → 🟢 Live
```

### 3️⃣ Get Your URL
At the top of page: `skin-disease-detection.onrender.com`

---

## ✅ PHASE 7: TEST (2 MIN)

### 1️⃣ Test Backend
Open in browser:
```
https://skin-disease-detection.onrender.com/api/
```

Should show Django REST Framework interface ✅

### 2️⃣ Check Logs for Errors
If deployment failed, look for error message in Logs

---

## 🎉 YOU'RE LIVE!

**Your app is now at:**
```
https://skin-disease-detection.onrender.com
```

**Total time: 15-20 minutes**

---

---

# ❌ IF SOMETHING GOES WRONG

## Common Problems & Fixes

| Problem | Solution |
|---------|----------|
| 🔴 "Failed" Status | Check Logs tab for error message |
| 403 GitHub Error | Go to GitHub settings/installations and add repo |
| "ModuleNotFoundError" | requirements.txt must be in ROOT directory (not backend/) |
| "SECRET_KEY not set" | Add SECRET_KEY variable in Environment tab |
| App Shows "Not Available" | Wait 10 minutes, or click "Manual Redeploy" |
| Static Files Missing | Ensure `collectstatic` runs in build.sh |
| Database Errors | Ensure `migrate` command runs in build.sh |

**If stuck:**
1. Check Logs for specific error
2. Click "Manual Redeploy" in service menu
3. Verify all environment variables are set
4. Push any fixes to GitHub and redeploy

---

---

# 📌 KEY FILES (Already Prepared)

```
✅ runtime.txt           → Python 3.10.11
✅ requirements.txt      → All dependencies (in root!)
✅ render.yaml          → Build & start configuration
✅ build.sh             → Migrations + static files
✅ settings.py          → Environment variables
```

**All files are ready. No code changes needed!**

---

# ⏱️ TIMELINE

```
0-3 min  → Create account & connect GitHub
3-8 min  → Create web service
8-10 min → Set environment variables
10-15 min → Monitor deployment
15-20 min → Test & verify
```

**Total: 15-20 minutes from start to live app**

---

# 🎓 AFTER DEPLOYMENT

### Monitor Your App
- Check Render dashboard daily
- Monitor logs for errors
- Watch performance metrics

### If Issues Occur
1. Go to service Logs
2. Look for error message
3. Fix locally if needed
4. Push to GitHub
5. Click "Manual Redeploy"

### Optional Next Steps
- Add custom domain
- Deploy frontend separately
- Set up database backups
- Configure email notifications

---

---

**READY TO START?**

**👉 Go to: https://render.com**

**Begin with Phase 1, Step 1 above**

**Follow each step in order - you'll have a live app in 15 minutes!**
