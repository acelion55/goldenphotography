<div align="center">

<!-- Animated Banner -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=C8941A&height=200&section=header&text=Golden%20Photography&fontSize=50&fontColor=fff&fontAlignY=38&desc=Premium%20Photography%20Portfolio%20•%20Beawar%2C%20Rajasthan&descAlignY=58&descSize=16&animation=fadeIn" width="100%"/>

<br/>

<!-- Live Badge -->
<a href="https://goldenphotography.vercel.app" target="_blank">
  <img src="https://img.shields.io/badge/🌐%20Live%20Preview-goldenphotography.vercel.app-C8941A?style=for-the-badge&logoColor=white" />
</a>

<br/><br/>

<!-- Tech Stack Badges -->
<img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/Framer_Motion-12-FF0055?style=flat-square&logo=framer&logoColor=white" />
<img src="https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=flat-square&logo=firebase&logoColor=black" />
<img src="https://img.shields.io/badge/Cloudinary-Storage-3448C5?style=flat-square&logo=cloudinary&logoColor=white" />
<img src="https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square&logo=vercel&logoColor=white" />

</div>

---

## 🏆 About This Project

> **Golden Photography** is a **paid commercial project** built for a professional photography business based in **Beawar, Rajasthan, India**. The client needed a modern, fully animated portfolio website to showcase their wedding, pre-wedding, birthday, maternity, and event photography work across Rajasthan.

This is not a template or side project — it is a **live production website** actively used by a real photography business to attract clients and showcase their portfolio.

---

## 🌟 What Was Built

### 🎬 Animated Loading Screen
- Letter-by-letter staggered scale animation for **"GOLDEN"** and **"PHOTOGRAPHY"**
- Golden particle burst explosion on entry
- Expanding concentric rings with fade
- Bottom progress bar sweep
- Smooth scale + fade exit transition
- Shows once per session

### 🏠 Home Page — Mobile-First Design
- **Full-screen hero** with owner bio, stats, and collage
- **Owner photo** — tall rectangle with absolute positioning, overflows upward
- **3-image collage** with random rotation angles + parallax scroll effect
- **Counting animation** — numbers count up from 0 (10+ years, 500+ weddings, 1000+ clients)
- **Infinite scrolling image strip** — tilted photos scroll horizontally with CSS animation, pauses on hover
- **Scroll-triggered gallery** — images scale in from bottom-left to top-right on scroll

### 🎨 Animated Desktop Navbar
- All items in one line with logo
- **Bottom-to-top fill animation** on hover — golden background slides up
- Active route underline with `layoutId` smooth transition
- Phone number in header

### 🖼️ Gallery System
- Masonry-style horizontal gallery
- Hover grayscale effect on non-hovered images
- Progressive blur overlay on hover
- Click to open full lightbox preview
- Scroll-triggered scale reveal animation

### 🦶 Animated Footer
- **Giant brand name watermark** in background — slides in on scroll
- Dark themed with golden accents
- Staggered nav links, contact info, social icons
- Animated golden divider line

### 🔐 Admin Panel
- Login with credentials
- **4 sections**: Gallery, Collage, Strip, Owner Photo
- Upload images to Cloudinary via backend API
- Save URLs to Firestore
- Delete images
- Stays on admin panel after every action

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 + shadcn/ui |
| Animations | Framer Motion 12 |
| Database | Firebase Firestore |
| File Storage | Cloudinary (via backend) |
| Deployment | Vercel |
| Fonts | Playfair Display + Poppins |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── LoadingScreen.tsx      # Animated entry screen
│   ├── PortfolioHeader.tsx    # Animated navbar
│   ├── PhotographerBio.tsx    # Hero section with collage + stats
│   ├── MasonryGallery.tsx     # Scroll-reveal gallery grid
│   ├── Lightbox.tsx           # Full-screen image preview
│   ├── PortfolioFooter.tsx    # Animated footer with brand watermark
│   └── FloatingButtons.tsx    # WhatsApp + call buttons
├── pages/
│   ├── Index.tsx              # Home page
│   ├── CategoryGallery.tsx    # Wedding/Birthday/etc galleries
│   ├── Contact.tsx            # Contact form
│   └── Admin.tsx              # Admin panel
├── services/
│   └── gallery.ts             # Firebase gallery service
├── lib/
│   └── firebase.ts            # Firebase config
└── contexts/
    └── AdminContext.tsx       # Admin auth state
```

---

## ✨ Key Animations

```
Loading Screen    →  Letter stagger + particle burst + rings
Hero Section      →  fadeUp stagger with useInView
Owner Photo       →  Scale in with absolute overflow
Collage Photos    →  Rotate + parallax on scroll
Stats Numbers     →  Count up from 0 with ease-out cubic
Image Strip       →  CSS infinite marquee + hover pause
Gallery Images    →  Scale from bottom-left on scroll enter
Navbar Hover      →  Bottom-to-top golden fill slide
Footer Brand      →  Slide in from left on scroll
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Add VITE_BACKEND_URL and Firebase config

# Run development server
npm run dev

# Build for production
npm run build
```

---

## 🌐 Live

**[goldenphotography.vercel.app](https://goldenphotography.vercel.app)**

---

## 💼 Business Info

| | |
|---|---|
| **Business** | Golden Photography |
| **Owner** | Gopal Das Vaishnav |
| **Location** | Beawar, Rajasthan, India |
| **Services** | Wedding, Pre-Wedding, Birthday, Maternity, Events |
| **Coverage** | Beawar · Ajmer · Jodhpur · Jaipur · Pali · Rajasthan |
| **Contact** | +91 99837 45802 |

---

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&color=C8941A&height=100&section=footer&animation=fadeIn" width="100%"/>

**Built with ❤️ for Golden Photography — A Paid Commercial Project**

</div>
