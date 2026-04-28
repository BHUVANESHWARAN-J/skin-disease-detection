#!/usr/bin/env python
import os
import sys
import django

# Add the backend directory to the Python path
sys.path.insert(0, os.path.dirname(__file__))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Configure Django
django.setup()

from ai.predict import run_prediction
from django.contrib.auth.models import User

def test_full_prediction():
    # Create a test user if needed
    try:
        user = User.objects.get(username='test_user')
    except User.DoesNotExist:
        user = User.objects.create_user(username='test_user', email='test@example.com', password='testpass')

    sample_path = 'd:/varshini_project/dataset/bcn_20k_test/BCN_0000002404.jpg'
    with open(sample_path, 'rb') as f:
        result = run_prediction(f, user)
        print('Prediction completed successfully!')
        print('Disease:', result['disease'])
        print('Confidence:', result['confidence'])
        print('Heatmap URL:', result['heatmap_url'])
        print('Processing URLs:', result['original_url'], result['processed_url'], result['augmented_url'])
        return result

if __name__ == '__main__':
    test_full_prediction()