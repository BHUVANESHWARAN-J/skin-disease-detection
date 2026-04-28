import requests
import json

print("1. Logging in...")
login_resp = requests.post(
    'http://127.0.0.1:8000/api/login/',
    json={'username': 'testuser123', 'password': 'testpass123'}
)

if login_resp.status_code != 200:
    print(f"❌ Login failed: {login_resp.text}")
    exit(1)

token = login_resp.json()['access']
print(f"✅ Login successful! Token: {token[:30]}...")

print("\n2. Testing prediction...")
r = requests.post(
    'http://127.0.0.1:8000/api/predict/',
    headers={'Authorization': f'Bearer {token}'},
    files={'image': open('dataset/bcn_20k_test/BCN_0000000042.jpg', 'rb')}
)

print(f'Status: {r.status_code}')
print(f'Response:')
print(json.dumps(r.json(), indent=2))
