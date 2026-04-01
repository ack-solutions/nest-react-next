#!/bin/sh

# Change to API directory
cd apps/api || exit 1

# Run migrations first
echo "🔄 Running migrations before starting server..."
pnpm migration:run || {
    echo "❌ Migration failed, exiting..."
    exit 1
}

# Start the server
echo "🚀 Starting server..."
exec node dist/main.js
