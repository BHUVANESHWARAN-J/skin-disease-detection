import requests
import json
import sys

print("=" * 70)
print("🔍 FULL SYSTEM VERIFICATION TEST")
print("=" * 70)

# Test 1: Register endpoint
print("\n[1] USER REGISTRATION ENDPOINT")
print("-" * 70)
try:
    resp = requests.post('http://127.0.0.1:8000/api/register/', 
        json={"username": "testuser_demo", "email": "test@demo.com", "password": "testpass123"})
    print(f"✅ Status: {resp.status_code}")
    if resp.status_code == 200:
        print(f"✅ Response: {resp.json()}")
    else:
        print(f"Response: {resp.text[:200]}")
except Exception as e:
    print(f"❌ Error: {str(e)}")

# Test 2: Login endpoint
print("\n[2] LOGIN ENDPOINT")
print("-" * 70)
try:
    resp = requests.post('http://127.0.0.1:8000/api/login/', 
        json={"username": "testuser_demo", "password": "testpass123"})
    print(f"Status: {resp.status_code}")
    if resp.status_code == 200:
        data = resp.json()
        print(f"✅ Login successful!")
        token = data.get('access')
        print(f"✅ Token obtained: {token[:20]}...")
    else:
        print(f"Response: {resp.text[:200]}")
except Exception as e:
    print(f"❌ Error: {str(e)}")

# Test 3: Admin panel
print("\n[3] DJANGO ADMIN PANEL")
print("-" * 70)
try:
    resp = requests.get('http://127.0.0.1:8000/admin/')
    if resp.status_code == 200:
        print(f"✅ Admin panel accessible: {resp.status_code}")
    else:
        print(f"Status: {resp.status_code}")
except Exception as e:
    print(f"❌ Error: {str(e)}")

# Test 4: Model loading
print("\n[4] KERAS MODEL LOADING")
print("-" * 70)
try:
    sys.path.insert(0, 'd:\\varshini_project\\backend')
    from ai.model_loader import model, label_encoder
    print(f"✅ Model loaded successfully!")
    print(f"   - Input shape: {model.input_shape}")
    print(f"   - Classes: {len(label_encoder.classes_)}")
    print(f"   - Disease classes: {list(label_encoder.classes_)}")
except Exception as e:
    print(f"❌ Error: {str(e)}")

# Test 5: Frontend files
print("\n[5] FRONTEND CONFIGURATION")
print("-" * 70)
try:
    with open('d:\\varshini_project\\frontend\\.env.local', 'r') as f:
        content = f.read()
        if 'VITE_API_URL' in content:
            print(f"✅ .env.local configured")
            print(f"   - Contains VITE_API_URL")
except Exception as e:
    print(f"⚠️  Warning: {str(e)}")

# Test 6: Database
print("\n[6] DATABASE STATUS")
print("-" * 70)
try:
    import django
    import os
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
    django.setup()
    from django.db import connection
    with connection.cursor() as cursor:
        cursor.execute("SELECT COUNT(*) FROM auth_user;")
        user_count = cursor.fetchone()[0]
    print(f"✅ Database connected!")
    print(f"   - Total users: {user_count}")
except Exception as e:
    print(f"Database Error: {str(e)}")

print("\n" + "=" * 70)
print("✅ SYSTEM CHECK COMPLETED")
print("=" * 70)
