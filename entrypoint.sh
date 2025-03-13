#!/bin/sh
echo "Populating database..."
python /app/populate.py

echo "Starting the application..."
exec python /app/app.py
