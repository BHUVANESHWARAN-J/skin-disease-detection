import requests
import json

token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzc3MTM4NTAxLCJpYXQiOjE3NzcxMzgyMDEsImp0aSI6Ijc4NjMwNGQ3OGEwNTQxM2JiNmQ5MjFmYTFlNmQ1YjIzIiwidXNlcl9pZCI6NX0.Wx0xyfJm2t3yt9ElujvT4KPtfT7XM4J3HqP8iKZHHcE'

r = requests.post(
    'http://127.0.0.1:8000/api/predict/',
    headers={'Authorization': f'Bearer {token}'},
    files={'image': open('dataset/bcn_20k_test/BCN_0000000042.jpg', 'rb')}
)

print('Status:', r.status_code)
if r.status_code == 200:
    print('Success!')
    print(json.dumps(r.json(), indent=2))
else:
    # Print lines containing "at " which indicates file/function in traceback
    lines = r.text.split('\n')
    for i, line in enumerate(lines):
        if 'ModuleNotFoundError' in line or 'No module named' in line:
            # Print context around error
            start = max(0, i-2)
            end = min(len(lines), i+3)
            for j in range(start, end):
                print(lines[j])
            break
