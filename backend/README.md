# Backend - Excel to PostgreSQL Import

This backend handles importing Excel data to PostgreSQL database.

## 📁 Structure

```
backend/
├── scripts/
│   ├── import_excel_to_postgres.py  # Main import script
│   ├── run_import.sh                 # Helper script
│   └── README.md                     # Detailed documentation
├── venv/                             # Python virtual environment
├── requirements.txt                   # Python dependencies
└── listing.xlsx                      # Excel file to import
```

## 🚀 Quick Start

### Option 1: Using Helper Script (Recommended)
```bash
cd backend
./scripts/run_import.sh
```

### Option 2: Manual Steps
```bash
cd backend

# Activate virtual environment
source venv/bin/activate

# Run import
python scripts/import_excel_to_postgres.py
```

## 📋 Prerequisites

1. **Python 3.9+** installed
2. **PostgreSQL** running and accessible
3. **Excel file** (`listing.xlsx`) in the `backend/` directory

## 🔧 Setup (First Time)

1. **Create virtual environment** (if not exists):
```bash
python3 -m venv venv
```

2. **Install dependencies**:
```bash
source venv/bin/activate
pip install -r requirements.txt
```

## 📊 Database Configuration

- **URL**: `postgresql://cafiasurvey:cafiasurvey@localhost:5432/CafiasurveyDB`
- **Table**: `survey_results`
- **Mode**: Replace (drops existing table)

To change these, edit `scripts/import_excel_to_postgres.py`.

## ✅ Verification

After import, verify data:
```bash
psql -U cafiasurvey -d CafiasurveyDB -c "SELECT COUNT(*) FROM survey_results;"
```
