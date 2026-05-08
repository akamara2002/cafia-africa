# How to Run the CAFIA Africa Project

This project is organized into separate **Frontend** and **Backend** directories for easy management.

## 📁 Project Structure

```
cafia-africa/
├── frontend/          # Next.js application
├── backend/           # Python scripts & data import
└── README.md          # Project overview
```

---

## 🚀 Quick Start

### Frontend (Next.js)

```bash
cd frontend
npm install          # First time only
npm run dev          # Start development server
```

**Access at:** http://localhost:3000

**Alternative (if file watch limit issues):**
```bash
npm run dev:webpack
```

---

### Backend (Excel to PostgreSQL Import)

```bash
cd backend
./scripts/run_import.sh    # Easiest way
```

**Or manually:**
```bash
cd backend
source venv/bin/activate
python scripts/import_excel_to_postgres.py
```

---

## 📋 Detailed Instructions

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies (first time only):**
   ```bash
   npm install
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Local: http://localhost:3000
   - Network: http://192.168.100.93:3000

**Available Commands:**
- `npm run dev` - Development with Turbopack
- `npm run dev:webpack` - Development without Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

See `frontend/README.md` for more details.

---

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Ensure Excel file is present:**
   - File should be at: `backend/listing.xlsx`
   - ✅ Already added by you!

3. **Run the import (easiest way):**
   ```bash
   ./scripts/run_import.sh
   ```

   This script will:
   - Check/create virtual environment
   - Install dependencies if needed
   - Run the import automatically

4. **Or run manually:**
   ```bash
   # Activate virtual environment
   source venv/bin/activate
   
   # Run import
   python scripts/import_excel_to_postgres.py
   ```

**Database Configuration:**
- URL: `postgresql://cafiasurvey:cafiasurvey@localhost:5432/CafiasurveyDB`
- Table: `survey_results`
- Excel file: `backend/listing.xlsx`

See `backend/README.md` for more details.

---

## 🔧 Troubleshooting

### Frontend Issues

**File Watch Limit Error:**
```bash
# Temporary fix (until reboot)
sudo sysctl fs.inotify.max_user_watches=524288

# Permanent fix
echo 'fs.inotify.max_user_watches=524288' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

Then use: `npm run dev:webpack`

**Port Already in Use:**
```bash
lsof -ti:3000 | xargs kill -9
```

**Dependencies Not Found:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Backend Issues

**Excel File Not Found:**
- Ensure `listing.xlsx` is in `backend/` directory
- Check: `ls backend/listing.xlsx`

**Database Connection Failed:**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test connection
psql -U cafiasurvey -d CafiasurveyDB -h localhost
```

**Virtual Environment Issues:**
```bash
cd backend
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**Permission Denied (run_import.sh):**
```bash
chmod +x backend/scripts/run_import.sh
```

---

## 🎯 Common Workflows

### Development Workflow

**Terminal 1 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 2 - Backend (when needed):**
```bash
cd backend
./scripts/run_import.sh
```

### Production Deployment

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

**Backend:**
- Ensure PostgreSQL is running
- Run import script to populate data
- Configure environment variables

---

## ✅ Verification Checklist

- [ ] Node.js installed (`node --version`)
- [ ] Python 3.9+ installed (`python3 --version`)
- [ ] PostgreSQL running (`sudo systemctl status postgresql`)
- [ ] Frontend dependencies installed (`cd frontend && npm install`)
- [ ] Backend dependencies installed (`cd backend && source venv/bin/activate && pip list`)
- [ ] Excel file in backend directory (`ls backend/listing.xlsx`)
- [ ] Database connection working

---

## 📚 Additional Documentation

- **Frontend**: See `frontend/README.md`
- **Backend**: See `backend/README.md`
- **Backend Scripts**: See `backend/scripts/README.md`

---

## 🆘 Need Help?

- Check individual README files in `frontend/` and `backend/`
- Review terminal output for specific error messages
- Check PostgreSQL logs: `sudo journalctl -u postgresql`
