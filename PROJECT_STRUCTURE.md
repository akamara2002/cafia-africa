# 📁 Project Structure

## Organization

The project is now organized into separate **frontend** and **backend** directories:

```
cafia-africa/
├── frontend/              # Next.js application
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── hooks/           # Custom hooks
│   ├── lib/             # Utilities
│   ├── public/          # Static assets
│   └── package.json     # Node.js dependencies
│
├── backend/              # Python data import
│   ├── scripts/         # Import scripts
│   ├── venv/           # Python virtual environment
│   ├── listing.xlsx     # Excel data file
│   └── requirements.txt # Python dependencies
│
├── RUN_PROJECT.md       # Complete setup guide
├── QUICK_START.md       # Quick reference
└── README.md            # Project overview
```

## Benefits

✅ **Clear separation** - Frontend and backend are isolated  
✅ **Easy to run** - Simple commands from each directory  
✅ **Better organization** - Related files grouped together  
✅ **Scalable** - Easy to add more backend services or frontend apps

## Quick Commands

**Frontend:**
```bash
cd frontend && npm run dev
```

**Backend:**
```bash
cd backend && ./scripts/run_import.sh
```

See [RUN_PROJECT.md](./RUN_PROJECT.md) for detailed instructions.
