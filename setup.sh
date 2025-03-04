#!/bin/bash
set -e

DATA_DIR="/var/lib/postgres/data"

# Initialize the database cluster if the data directory is empty
if [ ! -d "$DATA_DIR" ] || [ -z "$(ls -A "$DATA_DIR")" ]; then
    echo "Initializing PostgreSQL..."
    initdb -D "$DATA_DIR" --icu-locale=en_US.UTF-8
    echo "Configuring PostgreSQL for trust connections..."
    echo "host all all 127.0.0.1/32 trust" >> "$DATA_DIR/pg_hba.conf"
fi

echo "Starting PostgreSQL in the background..."
pg_ctl -D "$DATA_DIR" -l "$DATA_DIR/logfile" start

echo "Waiting for PostgreSQL to be ready..."
while ! pg_isready -q -d postgres; do
    sleep 1
done

# Create the database 'search_api' if it doesn't exist
if ! psql -lqt | cut -d \| -f 1 | grep -qw search_api; then
    echo "Creating database 'search_api'..."
    psql -c "CREATE DATABASE search_api;"
fi

# Execute the SQL script to set up your schema and tables
echo "Setting up schema and tables..."
psql -d search_api -f /app/db.sql

echo "Stopping temporary PostgreSQL instance..."
pg_ctl -D "$DATA_DIR" stop

echo "Starting PostgreSQL in the foreground..."
exec postgres -D "$DATA_DIR"
