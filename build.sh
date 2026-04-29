#!/bin/bash
set -e

cd backend

# Run database migrations
python manage.py migrate --noinput

# Collect static files
python manage.py collectstatic --noinput

echo "Build complete!"
