import os
import sys
sys.path.insert(0, 'd:\\varshini_project\\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from django.db import connection

print('=== DATABASE VERIFICATION ===')
with connection.cursor() as cursor:
    # Check total users
    cursor.execute('SELECT COUNT(*) FROM auth_user;')
    user_count = cursor.fetchone()[0]
    print(f'Total users in database: {user_count}')

    # Check our test user
    cursor.execute("SELECT id, username, email, date_joined FROM auth_user WHERE username='testuser123';")
    test_user = cursor.fetchone()
    if test_user:
        print(f'✅ Test user found: ID={test_user[0]}, Username={test_user[1]}, Email={test_user[2]}')
        print(f'   Joined: {test_user[3]}')
    else:
        print('❌ Test user not found')

    # Check all tables exist
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'auth_%' OR name LIKE 'api_%';")
    tables = cursor.fetchall()
    print(f'\nDatabase tables found: {len(tables)}')
    for table in tables:
        print(f'  - {table[0]}')

print(f'\nCurrent database: SQLite (db.sqlite3)')