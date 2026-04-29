# 🚀 RENDER DEPLOYMENT - VISUAL OVERVIEW

## Architecture Diagram

```
YOUR LOCAL MACHINE (d:\varshini_project)
│
├── 📄 runtime.txt           → Python version
├── 📄 requirements.txt       → Dependencies
├── 📄 render.yaml           → Build configuration
├── 📄 build.sh              → Run migrations + collect static
│
├── 📁 backend/
│   ├── manage.py
│   ├── backend/
│   │   ├── settings.py      → Environment variables
│   │   ├── wsgi.py
│   │   └── urls.py
│   ├── api/
│   └── ai/
│
└── 📁 frontend/
    ├── src/
    ├── package.json
    └── vite.config.js

          ⬇️ git push

GITHUB (your-username/skin-disease-detection)
│
├── ✅ All files above
├── ✅ Last commit with all fixes
└── ✅ Ready for Render

          ⬇️ Render clones & deploys

RENDER DASHBOARD
│
└── Web Service: skin-disease-detection
    │
    ├── 🔵 Build Phase
    │   ├── Clone repo from GitHub
    │   ├── Read runtime.txt (Python 3.10.11)
    │   ├── Read requirements.txt & install dependencies
    │   ├── Run build.sh
    │   │   ├── python manage.py migrate
    │   │   └── python manage.py collectstatic
    │   └── Build complete
    │
    ├── 🟢 Runtime Phase
    │   ├── Read environment variables
    │   ├── Start gunicorn
    │   ├── Bind to port 10000
    │   └── Listen for requests
    │
    └── 🌐 Live App
        └── https://skin-disease-detection.onrender.com
```

---

## Deployment Timeline

```
┌─────────────────────────────────────────────────────────────────┐
│ RENDER DEPLOYMENT TIMELINE                                      │
└─────────────────────────────────────────────────────────────────┘

TIME    ACTION                          STATUS
────────────────────────────────────────────────────────────────
00:00   ✅ Service creation initiated   🔵 Queued
00:30   ✅ Repo cloned from GitHub      🔵 Building
01:00   ✅ Dependencies installed       🔵 Building
01:30   ✅ Migrations running           🔵 Building
02:00   ✅ Static files collected       🔵 Building
02:30   ✅ Build complete               🟢 Starting
03:00   ✅ Gunicorn started             🟢 Live
03:30   ✅ Ready for requests           🟢 Active

TOTAL TIME: 3-5 minutes (first deploy)
FUTURE: 1-2 minutes (subsequent deploys)
```

---

## Deployment Workflow - Decision Tree

```
START
  │
  ├─ Have Render account?
  │  ├─ NO  → Create account at render.com (with GitHub)
  │  └─ YES → Continue
  │
  ├─ GitHub connected to Render?
  │  ├─ NO  → Connect GitHub in Render settings
  │  └─ YES → Continue
  │
  ├─ Code pushed to GitHub?
  │  ├─ NO  → Run: git push
  │  └─ YES → Continue
  │
  ├─ SECRET_KEY generated?
  │  ├─ NO  → Run: python -c "from django.core.management.utils..."
  │  └─ YES → Continue
  │
  ├─ Created Web Service in Render?
  │  ├─ NO  → New + → Web Service → Connect repo
  │  └─ YES → Continue
  │
  ├─ Added environment variables?
  │  ├─ NO  → Environment tab → Add SECRET_KEY, DEBUG, ALLOWED_HOSTS
  │  └─ YES → Continue
  │
  ├─ Service deployed?
  │  ├─ 🔵 Building → WAIT (3-5 minutes)
  │  ├─ 🟢 Live     → SUCCESS ✅
  │  └─ 🔴 Failed   → Check Logs, fix, redeploy
  │
  └─ Test app at: https://skin-disease-detection.onrender.com
     ├─ API responding?   → ✅ SUCCESS
     ├─ Errors in logs?   → Check troubleshooting
     └─ Static files OK?  → CSS/JS loaded?
```

---

## Quick Reference - What Each File Does

```
┌────────────────────────────────────────────────────────────┐
│ FILE PURPOSES IN DEPLOYMENT                                │
└────────────────────────────────────────────────────────────┘

runtime.txt
├─ Purpose: Tell Render which Python version to use
├─ Content: python-3.10.11
└─ Used by: Render build environment

requirements.txt
├─ Purpose: List all Python dependencies
├─ Content: Django, DRF, TensorFlow, etc.
└─ Used by: pip install (during build)

render.yaml
├─ Purpose: Configure how Render builds and runs app
├─ Content: 
│  ├─ buildCommand: bash build.sh
│  ├─ startCommand: gunicorn command
│  └─ envVars: Variables to set
└─ Used by: Render service orchestration

build.sh
├─ Purpose: Run before app starts (one-time setup)
├─ Actions:
│  ├─ python manage.py migrate (create DB schema)
│  └─ python manage.py collectstatic (copy static files)
└─ Used by: Render during build phase

settings.py
├─ Purpose: Django configuration
├─ Key part: Read environment variables
│  ├─ SECRET_KEY from env
│  ├─ DEBUG from env
│  └─ ALLOWED_HOSTS from env
└─ Used by: Django app at runtime

.env (local only)
├─ Purpose: Local development configuration
├─ NOT pushed to GitHub (in .gitignore)
└─ Render: Ignores this, uses Environment variables instead
```

---

## Environment Variables Flow

```
┌─────────────────────────────────────────────────────────────┐
│ ENVIRONMENT VARIABLES - WHERE THEY COME FROM               │
└─────────────────────────────────────────────────────────────┘

LOCAL DEVELOPMENT:
  .env file
    ↓
  load_dotenv() in settings.py
    ↓
  os.getenv("VARIABLE_NAME")
    ↓
  Used in Django

RENDER DEPLOYMENT:
  Render Dashboard → Environment tab
    ↓
  Set in render.yaml OR Render UI
    ↓
  Injected into container at runtime
    ↓
  os.getenv("VARIABLE_NAME") reads them
    ↓
  Used in Django

KEY VARIABLES FOR RENDER:
┌──────────────────────────────────────────────────────────┐
│ SECRET_KEY                                               │
│ ├─ Purpose: Django security key                          │
│ ├─ Value: Long random string (generated in Step 1)       │
│ └─ Set in: Render Environment tab                        │
├──────────────────────────────────────────────────────────┤
│ DEBUG                                                    │
│ ├─ Purpose: Production vs Development mode               │
│ ├─ Value: False (production)                             │
│ └─ Set in: Render Environment tab                        │
├──────────────────────────────────────────────────────────┤
│ ALLOWED_HOSTS                                            │
│ ├─ Purpose: Which domains can access app                 │
│ ├─ Value: skin-disease-detection.onrender.com,...        │
│ └─ Set in: Render Environment tab                        │
├──────────────────────────────────────────────────────────┤
│ PYTHON_VERSION                                           │
│ ├─ Purpose: Python interpreter version                   │
│ ├─ Value: 3.10.11                                        │
│ └─ Set in: render.yaml                                   │
├──────────────────────────────────────────────────────────┤
│ PORT                                                     │
│ ├─ Purpose: Which port app listens on                    │
│ ├─ Value: 10000                                          │
│ └─ Set in: render.yaml & gunicorn command                │
└──────────────────────────────────────────────────────────┘
```

---

## Deployment Sequence - Step by Step

```
STEP 1: PREPARE
  ✅ Generate SECRET_KEY
  ✅ Push code to GitHub
  ✅ Verify all files on GitHub

STEP 2: RENDER ACCOUNT
  ✅ Create account at render.com
  ✅ Sign up with GitHub

STEP 3: CONNECT GITHUB
  ✅ Link GitHub to Render
  ✅ Grant repository access

STEP 4: CREATE SERVICE
  ✅ Click: New + → Web Service
  ✅ Select: skin-disease-detection repo
  ✅ Enter: Service name, branch
  ✅ Click: Create Web Service

  ⏳ RENDER STARTS BUILDING
  ├─ Clones repo
  ├─ Installs dependencies
  ├─ Runs build.sh
  └─ Starts gunicorn

STEP 5: ENVIRONMENT VARIABLES
  ✅ Go to: Environment tab
  ✅ Add: SECRET_KEY
  ✅ Add: DEBUG = False
  ✅ Add: ALLOWED_HOSTS

STEP 6: MONITOR
  ✅ Watch: Logs tab
  ✅ Wait: Status changes to 🟢 Live
  ✅ Get: Your URL

STEP 7: TEST
  ✅ Visit: https://your-app.onrender.com
  ✅ Check: Logs for errors
  ✅ Verify: API endpoints working

STEP 8: DONE
  ✅ App is live!
  ✅ Share URL with users
  ✅ Monitor deployment
```

---

## File Structure on Render

```
/
├── runtime.txt                    ← Python version
├── requirements.txt               ← Dependencies
├── render.yaml                    ← Config (Render reads this)
├── build.sh                       ← Build script
│
└── backend/
    ├── manage.py
    ├── db.sqlite3                 ← Database (ephemeral on free tier)
    ├── staticfiles/               ← Generated by collectstatic
    ├── media/                     ← Uploaded files
    │
    ├── backend/
    │   ├── settings.py            ← Reads environment variables
    │   ├── wsgi.py
    │   └── urls.py
    │
    ├── api/
    └── ai/
```

---

## Common Errors - Quick Diagnosis

```
ERROR MESSAGE              LIKELY CAUSE           FIX
─────────────────────────────────────────────────────────────
"ModuleNotFoundError"      Missing dependency     Add to requirements.txt
                           OR wrong location      

"SECRET_KEY not set"       Env var missing        Add to Environment tab

"Connection refused"       App not started        Check logs

"db.sqlite3: permission"   Migrations failed      Verify build.sh runs migrate

"static files not found"   collectstatic failed   Verify build.sh runs it

"ALLOWED_HOSTS error"      Domain not configured  Add to Environment

Build status: 🔴 Failed    Various build errors   Check Logs for details
Build status: 🔵 Building  Normal - just wait     Takes 3-5 minutes
Build status: 🟢 Live      Deployed successfully  App is running!
```

---

## Success Indicators ✅

```
When deployment is successful, you should see:

✅ Build Status: 🟢 Live
✅ URL displayed: https://skin-disease-detection.onrender.com
✅ Logs show: "Running on..." or "Gunicorn started"
✅ NO error messages in logs
✅ Can access: /api/ endpoint
✅ All environment variables set
✅ Can reload page without errors
✅ Static files load (if any)
```

---

## Quick Terminal Commands

```powershell
# Check git status
git status

# See recent commits
git log --oneline -5

# Push to GitHub
git push

# Generate SECRET_KEY (if needed)
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

# Test Django locally (optional)
cd backend
python manage.py runserver

# Check Python version
python --version

# Check pip packages
pip list
```

---

**Everything is ready. Start deployment with Render!**
