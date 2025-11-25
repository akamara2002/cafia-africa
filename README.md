# CAFIA Africa - Financial Inclusion Platform

Center for Africa Financial Inclusion and Advancement (CAFIA) - An integrated solutions platform for financial inclusion and economic resilience across Africa.

## Quick Start - Local Development

### Prerequisites
- Node.js 18+ (Download: https://nodejs.org/)
- npm or yarn package manager

### Installation Steps

1. **Download the Project**
   - Click the "Download ZIP" button in v0 or clone from GitHub
   - Extract the ZIP file to your preferred location

2. **Install Dependencies**
   \`\`\`bash
   cd cafia-africa
   npm install
   \`\`\`

3. **Run Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open in Browser**
   - Navigate to http://localhost:3000
   - The site will auto-reload when you make changes

### Build for Production

\`\`\`bash
# Test production build locally
npm run build
npm start

# Access at http://localhost:3000
\`\`\`

**Build checks:**
- ✓ No TypeScript errors
- ✓ All images optimized
- ✓ Routes generated correctly
- ✓ API routes functional

## Deployment Guide

### Method 1: Deploy from v0 Directly to Vercel (Fastest)

1. **Publish from v0**
   - Click the "Publish" button in the top right corner of v0
   - v0 will automatically create a Vercel deployment
   - Your site will be live with a Vercel URL instantly

2. **Add Environment Variables in Vercel**
   - Go to your Vercel dashboard
   - Select your project
   - Navigate to Settings → Environment Variables
   - Add `GMAIL_USER` and `GMAIL_APP_PASSWORD`
   - Redeploy for changes to take effect

### Method 2: Download ZIP → GitHub → Vercel (Recommended for Full Control)

#### Step 1: Download and Setup Locally

1. **Download the Project**
   - In v0, click the three dots (⋯) in the top right
   - Select "Download ZIP"
   - Extract the ZIP file to your preferred location

2. **Install Dependencies**
   \`\`\`bash
   cd cafia-africa
   npm install
   \`\`\`

3. **Test Locally**
   \`\`\`bash
   npm run dev
   \`\`\`
   - Open http://localhost:3000
   - Verify everything works

4. **Setup Email (Important for Contact Form)**
   - Create `.env.local` file in project root
   - Add your Gmail credentials:
     \`\`\`env
     GMAIL_USER=cafia.africa@gmail.com
     GMAIL_APP_PASSWORD=your_16_character_app_password
     \`\`\`
   - See "Email Configuration" section below for App Password setup
   - Test the contact form locally

#### Step 2: Push to GitHub

1. **Initialize Git Repository**
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit: CAFIA Africa website"
   \`\`\`

2. **Create GitHub Repository**
   - Go to https://github.com/new
   - Create a new repository named "cafia-africa" (or your preferred name)
   - DO NOT initialize with README (we already have one)
   - Copy the repository URL

3. **Push to GitHub**
   \`\`\`bash
   git remote add origin https://github.com/YOUR_USERNAME/cafia-africa.git
   git branch -M main
   git push -u origin main
   \`\`\`

4. **Verify Upload**
   - Go to your GitHub repository
   - Check that all files are uploaded
   - Verify README displays correctly

#### Step 3: Deploy to Vercel from GitHub

1. **Connect Vercel to GitHub**
   - Go to https://vercel.com
   - Sign up/login with GitHub
   - Click "Add New Project"
   - Import your GitHub repository

2. **Configure Project**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build` (auto-filled)
   - Output Directory: `.next` (auto-filled)

3. **Add Environment Variables**
   - Before deploying, click "Environment Variables"
   - Add:
     \`\`\`
     GMAIL_USER = cafia.africa@gmail.com
     GMAIL_APP_PASSWORD = your_16_character_password
     \`\`\`
   - Select all environments (Production, Preview, Development)

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your site will be live at `your-project.vercel.app`

5. **Test Live Site**
   - Visit your Vercel URL
   - Test the contact form (should now send real emails)
   - Test all pages and features

#### Step 4: Custom Domain (Optional)

1. **Add Custom Domain in Vercel**
   - Go to Project Settings → Domains
   - Add your domain (e.g., cafia.africa)
   - Follow DNS configuration instructions

2. **Update DNS Records**
   - Add A record pointing to Vercel's IP
   - Or add CNAME record to `cname.vercel-dns.com`
   - Wait for DNS propagation (up to 48 hours)

3. **SSL Certificate**
   - Vercel automatically provides free SSL
   - Your site will be accessible at https://cafia.africa

### Method 3: Deploy with Vercel CLI

1. **Install Vercel CLI**
   \`\`\`bash
   npm i -g vercel
   \`\`\`

2. **Login to Vercel**
   \`\`\`bash
   vercel login
   \`\`\`

3. **Deploy**
   \`\`\`bash
   vercel
   \`\`\`
   - Follow the prompts
   - First deploy goes to preview URL
   
4. **Deploy to Production**
   \`\`\`bash
   vercel --prod
   \`\`\`

5. **Add Environment Variables**
   \`\`\`bash
   vercel env add GMAIL_USER
   vercel env add GMAIL_APP_PASSWORD
   \`\`\`

### Continuous Deployment

Once connected to GitHub, Vercel automatically:
- ✓ Deploys every push to `main` branch to production
- ✓ Creates preview deployments for pull requests
- ✓ Sends deployment notifications
- ✓ Provides deployment logs and analytics

**Workflow:**
1. Make changes locally
2. Test with `npm run dev`
3. Commit: `git commit -m "Your changes"`
4. Push: `git push`
5. Vercel automatically deploys (30-60 seconds)

### Troubleshooting Deployment

**Build fails on Vercel:**
\`\`\`bash
# Test build locally first
npm run build

# If it works locally but fails on Vercel:
# - Check Node.js version (Vercel uses Node 18+)
# - Ensure all dependencies are in package.json
# - Check deployment logs in Vercel dashboard
\`\`\`

**Contact form not sending emails:**
- Verify environment variables are set in Vercel
- Check you're using Gmail App Password, not regular password
- Ensure 2FA is enabled on Gmail account
- Check Vercel function logs for errors

**Images not loading:**
- Ensure images are in `/public/images/` directory
- Check image paths start with `/images/` not `./images/`
- Verify images were committed to GitHub

## Project Structure

\`\`\`
cafia-africa/
├── app/
│   ├── page.tsx              # Homepage
│   ├── about/page.tsx        # About page
│   ├── strategic-pillars/page.tsx
│   ├── contact/page.tsx
│   ├── blog/page.tsx
│   ├── datahub/page.tsx
│   └── layout.tsx            # Root layout
├── components/
│   ├── navbar.tsx
│   ├── footer.tsx
│   ├── hero-section.tsx
│   ├── strategic-pillars.tsx
│   ├── interactive-africa-map.tsx
│   ├── financial-inclusion-gallery.tsx
│   ├── LeaderCard.tsx
│   ├── image-modal.tsx
│   └── strategic-partners.tsx
├── lib/
│   ├── world-bank-api.ts     # World Bank data fetching
│   └── motion/variants.ts    # Framer Motion animations
├── public/
│   └── images/               # All images and assets
└── package.json
\`\`\`

## Features

### 1. Interactive Africa Map (54 Countries)

**Location:** Homepage and country selection modal

**Data Source:** World Bank Open Data API (Real-time)

**Metrics Displayed:**
- Population (Total) - `SP.POP.TOTL`
- Account Ownership (% age 15+) - `FX.OWN.TOTL.ZS`
- GDP Per Capita (current US$) - `NY.GDP.PCAP.CD`
- Mobile Subscriptions (per 100) - `IT.CEL.SETS.P2`
- Internet Users (% of population) - `IT.NET.USER.ZS`
- SME Count (Estimated from population/GDP data)

**How It Works:**
1. User clicks any country card or uses search
2. Modal opens with loading animation
3. System fetches from World Bank API via `lib/world-bank-api.ts`
4. Data displayed in glassmorphic metric cards
5. Data cached for 1 hour to minimize API calls

**Configuration:**
\`\`\`typescript
// lib/world-bank-api.ts
export const INDICATORS = {
  accountOwnership: 'FX.OWN.TOTL.ZS',
  gdpPerCapita: 'NY.GDP.PCAP.CD',
  population: 'SP.POP.TOTL',
  // Add more indicators here
}
\`\`\`

**No API Key Required** - World Bank API is completely open and free

### 2. Strategic Pillars Carousel

**Mobile Responsive:**
- Mobile: 1 card at a time (100% width)
- Tablet: 2 cards (50% width each)
- Desktop: 4 cards (25% width each)

**Features:**
- Auto-rotation every 3 seconds
- Pauses on hover/focus
- Navigation dots
- Smooth CSS transitions

**Technical Fix Applied:**
The carousel now uses `flex-shrink-0` with responsive Tailwind classes (`w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]`) instead of dynamic inline styles, matching the working HTML implementation.

### 3. Leadership Team with Photo Modal

**Location:** About page

**Team Members:**
- Parvinjeet Kaur (Founder & CEO)
- Dr. Muhammad-Abbas Conteh (Co-Founder & CTO)
- Alim Ismael Kamara (Co-Founder & COO)

**Features:**
- Click any photo to view fullscreen
- ESC key, X button, or click-outside to close
- Expandable biographies with "Read More" button

### 4. Financial Inclusion Gallery (Sierra Leone)

**Location:** Homepage

**Images:**
1. Freetown Street (Urban commerce)
2. Mobile Money Transaction (Digital payment)
3. Urban Finance (Freetown cityscape)
4. Mobile Money Agent (Orange Money kiosk)
5. Entrepreneur Portrait (Female business owner)

**Image Handling:**
- Uses Next.js Image component for optimization
- Lazy loading enabled
- Responsive sizing
- Auto-rotation carousel

### 5. Strategic Partners Section

**Location:** Homepage (last section before footer)

**Partners:**
1. Limkokwing University - Sierra Leone
2. Freetown Business Forum - Sierra Leone
3. Be Noor Capital - Malaysia

**Features:**
- Animated floating logos
- Expandable descriptions on mobile with "Read more" button
- Hover effects with scale and shadow
- Connection lines between partners (desktop)
- Scroll-triggered animations

### 6. Premium Animations

**Library:** Framer Motion 12

**Animation Types:**
- Scroll-triggered fade-ups
- Parallax effects on hero
- Floating currency symbols
- Glassmorphism hover effects
- Smooth page transitions

**Accessibility:**
- `prefers-reduced-motion` support
- Keyboard navigation
- ARIA labels
- Screen reader friendly

## Technology Stack

- **Framework:** Next.js 16 (App Router)
- **React:** 19.2
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion 12
- **Images:** Next.js Image optimization
- **Data:** World Bank Open Data API
- **Deployment:** Vercel

## Environment Variables

No environment variables required! The app works out of the box.

Optional (for future API integrations):
\`\`\`env
# Create .env.local file
NEXT_PUBLIC_ANALYTICS_ID=your_id_here
\`\`\`

## Email Configuration

### Important: Nodemailer Only Works After Deployment

**The contact form in v0 preview logs to console only.** This is because:
- v0 runs in a browser-based "Next.js" environment
- Nodemailer requires actual Node.js server to establish SMTP connections
- Browser environments can't open TCP connections to mail servers

**To enable real email sending:**
1. Download the project ZIP from v0
2. Run locally (`npm run dev`) with Gmail credentials in `.env.local`
3. OR deploy to Vercel with environment variables configured

Once deployed or running locally, the contact form will send real emails to **cafia.africa@gmail.com**.

### Setup Email Sending with Gmail SMTP (Recommended - Simple & Free)

**Why Gmail SMTP:**
- ✓ No domain verification required
- ✓ Works instantly
- ✓ Free with any Gmail account
- ✓ Very reliable
- ✓ Easy 5-minute setup

**Step-by-Step Setup:**

1. **Enable 2-Factor Authentication on Gmail**
   - Go to https://myaccount.google.com/security
   - Click "2-Step Verification"
   - Follow the setup wizard

2. **Create Gmail App Password**
   - After enabling 2FA, return to https://myaccount.google.com/security
   - Search for "App passwords" or scroll to find it
   - Click "App passwords"
   - Select "Mail" for the app type
   - Select "Other (Custom name)" for device
   - Name it "CAFIA Website"
   - Click "Generate"
   - **Copy the 16-character password** (shown with spaces like: `abcd efgh ijkl mnop`)

3. **Add Environment Variables**
   
   Create a `.env.local` file in your project root:
   
   \`\`\`env
   GMAIL_USER=cafia.africa@gmail.com
   GMAIL_APP_PASSWORD=abcdefghijklmnop
   \`\`\`
   
   **Important:** Remove all spaces from the app password when pasting

4. **Verify Setup**
   - Restart your dev server: `npm run dev`
   - Go to the Contact page
   - Submit a test message
   - Check cafia.africa@gmail.com inbox

**Troubleshooting:**
- If emails aren't sending, check the app password is correct
- Ensure 2FA is enabled on the Gmail account
- Check server console for error messages
- Try regenerating the app password

### Alternative Email Options

**Option 2: Resend**

1. Install Resend:
   \`\`\`bash
   npm install resend
   \`\`\`

2. Sign up at [resend.com](https://resend.com) and get your API key

3. Add to `.env.local`:
   \`\`\`env
   RESEND_API_KEY=your_resend_api_key_here
   \`\`\`

4. Uncomment the Resend code in `app/api/contact/route.ts` (marked with comments)

**Option 3: SendGrid**

1. Install SendGrid:
   \`\`\`bash
   npm install @sendgrid/mail
   \`\`\`

2. Get API key from [sendgrid.com](https://sendgrid.com)

3. Add to `.env.local`:
   \`\`\`env
   SENDGRID_API_KEY=your_sendgrid_api_key_here
   \`\`\`

**Contact Information:**
- Email: cafia.africa@gmail.com
- Phone: +60 18-393 7031

The form includes:
- Field validation
- Loading states
- Success/error messages
- Spam protection

## API Documentation

### World Bank API

**Base URL:** `https://api.worldbank.org/v2/`

**Example Request:**
\`\`\`
GET https://api.worldbank.org/v2/country/NG/indicator/FX.OWN.TOTL.ZS?format=json&date=2017:2023&per_page=10
\`\`\`

**Parameters:**
- `country`: ISO 3166-1 alpha-2 code (e.g., NG, KE, ZA)
- `indicator`: World Bank indicator code
- `format=json`: Response format
- `date`: Year range (e.g., 2017:2023)
- `per_page`: Results per page

**Response Structure:**
\`\`\`json
[
  {
    "page": 1,
    "total": 7
  },
  [
    {
      "indicator": {...},
      "country": {...},
      "value": 48.8,
      "date": "2021"
    }
  ]
]
\`\`\`

**Full Documentation:** https://datahelpdesk.worldbank.org/knowledgebase/articles/889392

## Common Issues & Solutions

### Issue: Pillars not showing correctly on mobile
**Solution:** The fix uses Tailwind's `flex-shrink-0` with responsive calc() widths instead of inline styles. Cards now display at 100% width on mobile as intended.

### Issue: Images not loading
**Solution:** 
1. Check that images exist in `/public/images/`
2. Restart dev server after adding new images
3. Clear browser cache

### Issue: World Bank API timeout
**Solution:** 
1. Check internet connection
2. API might be temporarily down (check status.worldbank.org)
3. Data will show "N/A" if unavailable

### Issue: Build errors
**Solution:**
\`\`\`bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next
npm run build
\`\`\`

### Issue: Partner descriptions cut off on mobile
**Solution:** Click the "Read more" button below each partner card to expand the full description. On tablets and desktops, descriptions show in full automatically.

## Performance Optimization

- **Image Optimization:** Next.js automatically optimizes all images
- **API Caching:** World Bank data cached for 1 hour in memory
- **Code Splitting:** Automatic per-route code splitting
- **Lazy Loading:** Components load only when needed
- **Static Generation:** Pages pre-rendered at build time

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

Copyright © 2025 CAFIA Africa. All rights reserved.

## Support

For issues or questions:
- GitHub Issues: [Your repo URL]
- Email: info@cafia.africa
- Website: https://cafia.africa

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## Changelog

### Version 1.0.0 (Current)
- Initial release
- 54 African countries with real World Bank data
- Strategic Pillars carousel with mobile fix
- Leadership team with photo modals
- Financial inclusion gallery
- Strategic Partners section with expandable descriptions
- Premium animations throughout
- Fully responsive design
- Contact form with Gmail SMTP integration
