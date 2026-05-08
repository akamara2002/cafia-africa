# Excel to PostgreSQL Import Script

This script imports data from `listing.xlsx` to PostgreSQL database.

## Prerequisites

1. Python 3.9 or higher
2. PostgreSQL database running
3. Excel file (`listing.xlsx`) in the project root directory

## Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

Or install individually:
```bash
pip install pandas sqlalchemy psycopg2-binary openpyxl
```

## Usage

1. Place your Excel file (`listing.xlsx`) in the project root directory
2. Ensure PostgreSQL is running and the database is accessible
3. Run the import script:

```bash
python scripts/import_excel_to_postgres.py
```

Or from the scripts directory:
```bash
cd scripts
python import_excel_to_postgres.py
```

## Configuration

The script uses the following default settings:
- **Database URL**: `postgresql://cafiasurvey:cafiasurvey@localhost:5432/CafiasurveyDB`
- **Excel File**: `listing.xlsx` (in project root)
- **Table Name**: `survey_results`
- **Import Mode**: `replace` (replaces existing table)

To change these, edit the constants at the top of `import_excel_to_postgres.py`.

## Features

- ✅ Automatic table creation
- ✅ Column type inference
- ✅ Data validation and cleaning
- ✅ Column name normalization
- ✅ Missing value detection
- ✅ Bulk import for performance
- ✅ Error handling and verification

## Output

The script will:
1. Read and validate the Excel file
2. Display data summary (rows, columns, missing values)
3. Clean and normalize column names
4. Import data to PostgreSQL
5. Verify the import was successful

## Troubleshooting

**File not found**: Ensure `listing.xlsx` is in the project root directory

**Database connection error**: 
- Check PostgreSQL is running: `sudo systemctl status postgresql`
- Verify connection string is correct
- Check database exists: `psql -U cafiasurvey -d CafiasurveyDB`

**Import errors**: Check the error message for specific issues (data types, constraints, etc.)
