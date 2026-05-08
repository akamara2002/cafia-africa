#!/usr/bin/env python3
"""
Excel to PostgreSQL Import Script
Imports data from listing.xlsx to PostgreSQL database
"""

import pandas as pd
from sqlalchemy import create_engine, text
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from backend/.env (if present)
load_dotenv()

# Excel file path (relative to project root)
EXCEL_FILE = "listing.xlsx"
TABLE_NAME = "survey_results"


def validate_excel_file(file_path: str) -> bool:
    """Check if Excel file exists and is readable"""
    if not os.path.exists(file_path):
        print(f"❌ Error: Excel file not found at '{file_path}'")
        print(f"   Please ensure the file exists in the backend directory.")
        return False
    
    if not file_path.endswith(('.xlsx', '.xls')):
        print(f"❌ Error: File '{file_path}' is not an Excel file (.xlsx or .xls)")
        return False
    
    return True


def read_excel(file_path: str) -> pd.DataFrame:
    """Read Excel file and return DataFrame"""
    try:
        print(f"📖 Reading Excel file: {file_path}")
        df = pd.read_excel(file_path)
        print(f"✅ Successfully read {len(df)} rows and {len(df.columns)} columns")
        return df
    except Exception as e:
        print(f"❌ Error reading Excel file: {e}")
        raise


def validate_data(df: pd.DataFrame) -> None:
    """Validate and display data information"""
    print("\n📊 Data Summary:")
    print(f"   Rows: {len(df)}")
    print(f"   Columns: {len(df.columns)}")
    print(f"\n📋 Column Names:")
    for i, col in enumerate(df.columns, 1):
        print(f"   {i}. {col}")
    
    print(f"\n🔍 Missing Values:")
    missing = df.isnull().sum()
    if missing.sum() > 0:
        for col, count in missing[missing > 0].items():
            print(f"   {col}: {count} missing values")
    else:
        print("   No missing values found")
    
    print(f"\n📈 Data Types:")
    for col, dtype in df.dtypes.items():
        print(f"   {col}: {dtype}")


def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    """Clean and preprocess data"""
    print("\n🧹 Cleaning data...")
    
    # Normalize column names (lowercase, replace spaces with underscores)
    df.columns = df.columns.str.strip().str.lower().str.replace(' ', '_').str.replace('-', '_')
    
    # Remove leading/trailing whitespace from string columns
    for col in df.select_dtypes(include=['string', 'object']).columns:
        df[col] = df[col].astype(str).str.strip()
        # Replace empty strings with None
        df[col] = df[col].replace('', None)
    
    print("✅ Data cleaned successfully")
    return df


def import_to_postgres(df: pd.DataFrame, table_name: str, if_exists: str = "replace") -> None:
    """Import DataFrame to PostgreSQL"""
    print(f"\n🔌 Connecting to PostgreSQL database...")

    try:
        database_url = os.getenv("DATABASE_URL")
        if not database_url:
            raise ValueError("DATABASE_URL is not set. Add it to your environment before importing.")

        engine = create_engine(database_url)
        
        # Test connection
        with engine.connect() as conn:
            print("✅ Database connection successful")
        
        print(f"\n📤 Importing data to table '{table_name}'...")
        print(f"   Mode: {if_exists} (existing data will be {'replaced' if if_exists == 'replace' else 'appended'})")
        
        # Import data
        df.to_sql(
            table_name,
            engine,
            if_exists=if_exists,
            index=False,
            method='multi',  # Faster bulk insert
            chunksize=1000   # Process in chunks for large files
        )
        
        print(f"✅ Data imported successfully!")
        print(f"✅ Imported {len(df)} rows to table '{table_name}'")
        
        # Verify import
        try:
            with engine.connect() as conn:
                result = conn.execute(text(f"SELECT COUNT(*) FROM {table_name}"))
                count = result.scalar()
                print(f"✅ Verified: {count} rows in database")
        except Exception as verify_error:
            print(f"⚠️  Verification warning: {verify_error}")
            print("   (Data was imported successfully, but verification query failed)")
        
        engine.dispose()
        
    except Exception as e:
        print(f"❌ Error importing to PostgreSQL: {e}")
        raise


def main():
    """Main function"""
    print("=" * 60)
    print("Excel to PostgreSQL Import Script")
    print("=" * 60)
    
    # Get backend directory (where Excel file should be)
    script_dir = Path(__file__).parent
    backend_dir = script_dir.parent
    excel_path = backend_dir / EXCEL_FILE
    
    # Validate Excel file
    if not validate_excel_file(str(excel_path)):
        sys.exit(1)
    
    try:
        # Read Excel file
        df = read_excel(str(excel_path))
        
        # Validate data
        validate_data(df)
        
        # Clean data
        df = clean_data(df)
        
        # Import to PostgreSQL
        import_to_postgres(df, TABLE_NAME, if_exists="replace")
        
        print("\n" + "=" * 60)
        print("✅ Import completed successfully!")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ Import failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
