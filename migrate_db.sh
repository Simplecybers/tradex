#!/bin/bash

# Set your local PostgreSQL details (running on Laragon)
LOCAL_DB="tradexcapital"
LOCAL_USER="postgres"
BACKUP_FILE="backup.sql"

# Set your Supabase PostgreSQL details
SUPABASE_HOST="db.xahamjmrewfbpubiyewg.supabase.co"
SUPABASE_DB="postgres"
SUPABASE_USER="postgres"

# Function to check if PostgreSQL tools are installed
check_postgres_tools() {
    if ! command -v pg_dump &> /dev/null || ! command -v psql &> /dev/null; then
        echo "Error: PostgreSQL tools (pg_dump, psql) not found. Ensure PostgreSQL is installed and added to your PATH."
        exit 1
    fi
}

# Step 1: Export the database from Laragon
export_database() {
    echo "Exporting PostgreSQL database from Laragon..."
    pg_dump -U $LOCAL_USER -d $LOCAL_DB -F c -f $BACKUP_FILE

    if [ $? -eq 0 ]; then
        echo "✅ Database successfully exported to $BACKUP_FILE"
    else
        echo "❌ Failed to export the database."
        exit 1
    fi
}

# Step 2: Restore the database to Supabase
restore_database() {
    echo "Restoring database to Supabase..."
    pg_restore -h $SUPABASE_HOST -U $SUPABASE_USER -d $SUPABASE_DB -W $BACKUP_FILE

    if [ $? -eq 0 ]; then
        echo "✅ Database successfully restored to Supabase!"
    else
        echo "❌ Failed to restore the database to Supabase."
        exit 1
    fi
}

# Execute the functions
check_postgres_tools
export_database
restore_database
