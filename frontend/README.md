# Frontend - Next.js Application

This is the frontend Next.js application for CAFIA Africa.

## 🚀 Quick Start

```bash
cd frontend
npm install
npm run dev
```

Access at: http://localhost:3000

## 📋 Available Scripts

- `npm run dev` - Start development server (with Turbopack)
- `npm run dev:webpack` - Start development server (without Turbopack)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🔧 Troubleshooting

**File Watch Limit Error:**
```bash
# Temporary fix
sudo sysctl fs.inotify.max_user_watches=524288

# Permanent fix
echo 'fs.inotify.max_user_watches=524288' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

Then use: `npm run dev:webpack`

## 📁 Project Structure

```
frontend/
├── app/              # Next.js app directory
├── components/       # React components
├── hooks/            # Custom React hooks
├── lib/              # Utility libraries
├── public/           # Static assets
└── styles/           # Global styles
```
