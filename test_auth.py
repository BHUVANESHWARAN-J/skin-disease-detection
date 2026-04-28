import requests
import json
import os
import django

print('=== TESTING REGISTRATION & LOGIN ===')
print()

# Test 1: Registration
print('1. Testing User Registration...')
try:
    resp = requests.post('http://127.0.0.1:8000/api/register/',
        json={'username': 'testuser123', 'email': 'test@example.com', 'password': 'testpass123'})
    print(f'   Status: {resp.status_code}')
    if resp.status_code == 200:
        print('   ✅ Registration successful!')
        print(f'   Response: {resp.json()}')
    else:
        print(f'   ❌ Registration failed: {resp.text}')
except Exception as e:
    print(f'   ❌ Error: {str(e)}')

print()

# Test 2: Login
print('2. Testing User Login...')
try:
    resp = requests.post('http://127.0.0.1:8000/api/login/',
        json={'username': 'testuser123', 'password': 'testpass123'})
    print(f'   Status: {resp.status_code}')
    if resp.status_code == 200:
        data = resp.json()
        print('   ✅ Login successful!')
        access_token = data.get('access', '')
        refresh_token = data.get('refresh', '')
        print(f'   Access Token: {access_token[:20]}...')
        print(f'   Refresh Token: {refresh_token[:20]}...')
    else:
        print(f'   ❌ Login failed: {resp.text}')
except Exception as e:
    print(f'   ❌ Error: {str(e)}')

print()
print('=== DATABASE CHECK ===')

# Check database tables
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()
from django.db import connection

with connection.cursor() as cursor:
    # Check user table
    cursor.execute('SELECT COUNT(*) FROM auth_user;')
    user_count = cursor.fetchone()[0]
    print(f'Users in database: {user_count}')

    # Check if our test user was created
    cursor.execute("SELECT username, email FROM auth_user WHERE username='testuser123';")
    test_user = cursor.fetchone()
    if test_user:
        print(f'Test user found: {test_user}')
    else:
        print('Test user not found in database')

print()
print('=== CURRENT DATABASE CONFIG ===')
print(f'Default database: SQLite (db.sqlite3)')