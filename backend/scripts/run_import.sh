#!/bin/bash
# Helper script to run Excel to PostgreSQL import

# Get backend directory (parent of scripts)
BACKEND_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$BACKEND_DIR" || exit 1

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found. Creating..."
    python3 -m venv venv
    echo "✅ Virtual environment created"
    echo "📦 Installing dependencies..."
    source venv/bin/activate
    pip install -r requirements.txt
fi

# Activate virtual environment
source venv/bin/activate

# Check if Excel file exists
if [ ! -f "listing.xlsx" ]; then
    echo "❌ Error: listing.xlsx not found in backend directory"
    echo "   Please place your Excel file in: $BACKEND_DIR/listing.xlsx"
    exit 1
fi

# Run the import script
echo "🚀 Starting import..."
python3 scripts/import_excel_to_postgres.py
