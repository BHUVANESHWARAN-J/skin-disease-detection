#!/bin/bash
set -e

cd backend

# Collect static files
python manage.py collectstatic --noinput

echo "Build complete!"
