# 🪙 NumisNest — Indian Numismatic Heritage Platform

<div align="center">

![NumisNest](https://img.shields.io/badge/NumisNest-Indian%20Numismatic%20Heritage-d97706?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2Q5NzQwNiIgZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgMThjLTQuNDIgMC04LTMuNTgtOC04czMuNTgtOCA4LTggOCAzLjU4IDggOC0zLjU4IDgtOCA4eiIvPjwvc3ZnPg==)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-61DAFB?style=for-the-badge&logo=react)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge)

**A full-stack web platform preserving India's rich numismatic heritage.**  
Explore rare coins spanning ancient empires, medieval dynasties, and the modern Republic.

[🌐 Live Demo](https://numis-nest-hppf.vercel.app/) · [🐛 Report Bug](https://github.com/ShivamSharma43/NumisNest/issues) · [✨ Request Feature](https://github.com/ShivamSharma43/NumisNest/issues)

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Admin Portal](#-admin-portal)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [Author](#-author)

---

## 🏛️ About the Project

NumisNest is a **full-stack MERN application** that serves as a digital museum and catalog for Indian historical coins. It enables collectors, historians, and enthusiasts to explore, learn about, and inquire about rare coins from across India's rich numismatic history — spanning ancient, medieval, British colonial, and modern Republic eras.

The platform consists of **three separate applications**:
- **Frontend** — Public-facing site for coin browsing, articles, and user accounts
- **Admin Portal** — Secure dashboard for content management, inquiry handling, and analytics
- **Backend** — RESTful API server handling all data, authentication, and email services

---

## ✨ Features

### 🌐 Frontend (User-Facing)

| Feature | Description |
|---------|-------------|
| 🔍 **Coin Catalog** | Browse all coins with live search (debounced), denomination filter, material filter, rarity slider, and sort options |
| 🏷️ **Denomination Browse** | Homepage cards linking directly to filtered catalog by coin type (Old, ₹1, ₹2, ₹5, ₹10, ₹20) |
| 📖 **Articles** | Educational numismatic articles with category filter, search, and featured article spotlight |
| ❤️ **Wishlist** | Save favourite coins to a personal wishlist (requires login) |
| 📨 **Inquiries** | Send inquiries about specific coins directly from the coin detail page |
| 👤 **User Dashboard** | View profile, manage wishlist, track sent inquiries |
| 🔑 **Auth System** | Register, login, change password, forgot password via email OTP |
| 🌙 **Dark / Light Mode** | Toggle between themes, persisted to localStorage |
| 📱 **Responsive** | Fully responsive on mobile, tablet, and desktop |

### 🛡️ Admin Portal

| Feature | Description |
|---------|-------------|
| 📊 **Dashboard** | Live stats — total coins, users, inquiries, new today |
| 📈 **Analytics** | Charts for most-viewed coins, era popularity, inquiry trends, material distribution |
| 🪙 **Manage Coins** | Full CRUD — add, edit, delete, publish/unpublish coins; image via URL |
| 📝 **Manage Articles** | Create, edit, delete, publish/unpublish articles; mark as featured |
| 💬 **Manage Inquiries** | View all inquiries, reply via email (Gmail SMTP), update status, auto-delete when closed |
| 🔐 **Session Security** | Session expires on browser close (sessionStorage, not localStorage) |

### ⚙️ Backend

| Feature | Description |
|---------|-------------|
| 🔐 **JWT Auth** | Secure authentication with role-based access (user / admin) |
| 📧 **Email OTP** | Password reset via 6-digit OTP sent through Gmail (nodemailer) |
| ☁️ **Cloudinary** | Image hosting integration |
| 🛡️ **Admin Guard** | Separate middleware protecting all `/api/admin/*` routes |
| 🌱 **Auto Seed** | Admin user auto-created on first startup from `.env` credentials |

---

## 🛠️ Tech Stack

### Frontend & Admin
| Technology | Purpose |
|-----------|---------|
| **React 18** + **TypeScript** | UI framework |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Utility-first styling |
| **shadcn/ui** | Component library |
| **Framer Motion** | Animations |
| **React Router v6** | Client-side routing |
| **TanStack Query** | Server state management (admin) |
| **Axios** | HTTP client (frontend) |
| **Recharts** | Analytics charts |
| **Lucide React** | Icon library |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** + **Express.js** | Server framework |
| **MongoDB** + **Mongoose** | Database & ODM |
| **JWT** | Authentication tokens |
| **bcryptjs** | Password hashing |
| **Nodemailer** | Email (OTP & inquiry replies) |
| **Cloudinary** | Image upload & storage |
| **Multer** | File upload middleware |
| **CORS** | Cross-origin resource sharing |

---

## 📁 Project Structure

```
NumisNest/
├── backend/                    # Express API server
│   ├── config/
│   │   ├── mongodb.js          # Database connection
│   │   ├── cloudinary.js       # Cloudinary setup
│   │   ├── mailer.js           # Nodemailer (Gmail SMTP)
│   │   └── seedAdmin.js        # Auto-create admin on startup
│   ├── controllers/
│   │   ├── authController.js   # Register, login, OTP reset
│   │   ├── coinController.js   # Public coin endpoints
│   │   ├── articleController.js
│   │   ├── inquiryController.js
│   │   ├── wishlistController.js
│   │   └── adminController.js  # Admin-only endpoints
│   ├── middleware/
│   │   ├── auth.js             # JWT verify + populate req.user
│   │   └── adminAuth.js        # Role check (admin only)
│   ├── models/
│   │   ├── User.js
│   │   ├── Coin.js
│   │   ├── Article.js
│   │   ├── Inquiry.js
│   │   └── OTP.js              # 10-min TTL OTP storage
│   ├── routes/
│   │   ├── auth.js
│   │   ├── coins.js
│   │   ├── articles.js
│   │   ├── wishlist.js
│   │   ├── inquiries.js
│   │   └── admin.js            # /api/admin/* (protected)
│   ├── scripts/
│   │   └── resetAdmin.js       # One-time admin DB fix script
│   ├── .env                    # Environment variables
│   ├── server.js
│   └── package.json
│
├── frontend/                   # React user-facing app (port 8080)
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/         # Navbar, Footer, Layout
│   │   │   ├── home/           # HeroSection, FeaturedCoins, CoinTypeHighlight
│   │   │   ├── coins/          # CoinCard, CoinCardSkeleton
│   │   │   ├── articles/       # ArticleCard, CategoryFilter
│   │   │   └── dashboard/      # ProfileTab, WishlistTab, InquiriesTab
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx
│   │   │   └── WishlistContext.tsx
│   │   ├── hooks/
│   │   │   └── useDebounce.ts
│   │   ├── pages/
│   │   │   ├── Index.tsx        # Home
│   │   │   ├── Coins.tsx        # Catalog with filters
│   │   │   ├── CoinDetails.tsx
│   │   │   ├── Articles.tsx
│   │   │   ├── ArticleDetails.tsx
│   │   │   ├── Dashboard.tsx    # User account
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── ForgotPassword.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Privacy.tsx
│   │   │   ├── Terms.tsx
│   │   │   └── FAQ.tsx
│   │   ├── services/            # API calls (axios)
│   │   └── types/               # TypeScript interfaces
│   ├── public/
│   ├── .env
│   └── package.json
│
└── admin/                      # React admin portal (port 8081)
    ├── src/
    │   ├── components/
    │   │   ├── admin/           # AdminLayout, Sidebar, TopBar
    │   │   ├── coins/           # CoinTable, CoinFormDialog (multi-step)
    │   │   ├── articles/        # ArticleTable, ArticleFormDialog
    │   │   ├── inquiries/       # InquiryTable, EmailReplyDialog
    │   │   └── charts/          # Dashboard chart components
    │   ├── contexts/
    │   │   └── AuthContext.tsx  # sessionStorage-based auth
    │   ├── hooks/               # useCoins, useArticles, useInquiries, useDashboard
    │   ├── lib/api/             # fetch-based API clients
    │   ├── pages/
    │   │   ├── Dashboard.tsx
    │   │   ├── ManageCoins.tsx
    │   │   ├── ManageArticles.tsx
    │   │   ├── ManageInquiries.tsx
    │   │   ├── Analytics.tsx
    │   │   └── Login.tsx
    │   └── types/
    ├── .env
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **MongoDB Atlas** account (free tier works)
- **Cloudinary** account (free tier works)
- **Gmail account** with App Password enabled (for email OTP)

### 1. Clone the Repository

```bash
git clone https://github.com/ShivamSharma43/NumisNest.git
cd NumisNest
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file (see [Environment Variables](#-environment-variables) below), then:

```bash
npm start          # production
# or
npm run dev        # development (nodemon)
```

On first startup the admin user is **automatically created** from your `.env` credentials.

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev        # runs on http://localhost:8080
```

### 4. Setup Admin Portal

```bash
cd admin
npm install
npm run dev        # runs on http://localhost:8081
```

### Startup Order

Always start **backend first**, then frontend and admin:

```
1. backend  →  npm start        (port 5000)
2. frontend →  npm run dev      (port 8080)
3. admin    →  npm run dev      (port 8081)
```

---

## 🔐 Environment Variables

### `backend/.env`

```env
# Server
PORT=5000

# Database
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/?appName=Cluster0

# Auth
JWT_SECRET=your_strong_secret_here
JWT_EXPIRE=7d

# Admin (auto-seeded on first startup)
ADMIN_EMAIL=your_admin@email.com
ADMIN_PASSWORD=YourAdminPassword

# Cloudinary (image hosting)
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_secret
CLOUDINARY_NAME=your_cloud_name

# CORS — comma-separated allowed origins
FRONTEND_URL=http://localhost:8080,http://localhost:8081

# Email (Gmail SMTP — must be an App Password, NOT your regular password)
MAIL_USER=official.numisnest@gmail.com
MAIL_PASS=your16charapppassword
```

> **⚠️ Gmail App Password:** Go to `myaccount.google.com → Security → 2-Step Verification → App Passwords`. Generate one for "Mail". Use the 16-character code as `MAIL_PASS` — your regular password will not work.

### `frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=NumisNest
VITE_USE_MOCK_FALLBACK=false
VITE_DEV_MODE=false
VITE_ITEMS_PER_PAGE=12
```

### `admin/.env`

```env
VITE_BACKEND_URL=http://localhost:5000/api
```

---

## 📡 API Reference

### Auth  `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/register` | — | Create new user account |
| `POST` | `/login` | — | Login, returns JWT token |
| `GET` | `/profile` | User | Get current user profile |
| `PUT` | `/profile` | User | Update name / avatar |
| `PUT` | `/change-password` | User | Change password |
| `POST` | `/forgot-password` | — | Send OTP to email |
| `POST` | `/reset-password` | — | Verify OTP + set new password |
| `GET` | `/verify` | User | Verify token validity |

### Coins  `/api/coins`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | — | List coins (search, denomination, material, rarity, sort, page) |
| `GET` | `/featured` | — | Featured coins for homepage |
| `GET` | `/:id` | — | Single coin details |
| `GET` | `/:id/related` | — | Related coins (same era/material) |
| `POST` | `/:id/views` | — | Increment view count |

### Articles  `/api/articles`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | — | List published articles (search, category, page) |
| `GET` | `/featured` | — | Featured articles |
| `GET` | `/categories` | — | Distinct category list |
| `GET` | `/:id` | — | Single article |
| `POST` | `/:id/views` | — | Increment view count |

### Wishlist  `/api/wishlist`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | User | Get wishlist with full coin data |
| `GET` | `/ids` | User | Get wishlist coin IDs only |
| `POST` | `/` | User | Add coin `{ coinId }` |
| `DELETE` | `/:coinId` | User | Remove coin |
| `DELETE` | `/` | User | Clear entire wishlist |

### Inquiries  `/api/inquiries`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/` | User | Create inquiry `{ coinId, coinName, message }` |
| `GET` | `/` | User | Get user's own inquiries |
| `GET` | `/:id` | User | Single inquiry |
| `DELETE` | `/:id` | User | Cancel inquiry |

### Admin  `/api/admin` *(requires admin role)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/dashboard/stats` | Totals: coins, users, inquiries, new today |
| `GET` | `/dashboard/analytics` | Full analytics data for charts |
| `GET` | `/dashboard/charts/most-viewed-coins` | Top viewed coins |
| `GET` | `/dashboard/charts/era-popularity` | Coins by era |
| `GET` | `/dashboard/charts/inquiry-trends` | Inquiry volume over time |
| `GET` | `/coins` | All coins (including drafts) |
| `POST` | `/coins` | Create coin |
| `PUT` | `/coins/:id` | Update coin |
| `DELETE` | `/coins/:id` | Delete coin |
| `PATCH` | `/coins/:id/featured` | Toggle featured |
| `GET` | `/articles` | All articles (including drafts) |
| `POST` | `/articles` | Create article |
| `PUT` | `/articles/:id` | Update article |
| `DELETE` | `/articles/:id` | Delete article |
| `PATCH` | `/articles/:id/published` | Toggle published |
| `PATCH` | `/articles/:id/featured` | Toggle featured |
| `GET` | `/inquiries` | All inquiries |
| `PATCH` | `/inquiries/:id/status` | Update status |
| `POST` | `/inquiries/:id/reply` | Send email reply (auto-sets status to contacted) |
| `DELETE` | `/inquiries/:id` | Delete inquiry |
| `GET` | `/users` | All users |

---

## 🛡️ Admin Portal

Access the admin portal at `http://localhost:8081`.

### First Login

The admin account is **auto-created** on first backend startup using your `.env` credentials:

```
Email:    ADMIN_EMAIL  (from .env)
Password: ADMIN_PASSWORD  (from .env)
```

If you registered via the frontend with the same email before running the backend, run the reset script once:

```bash
cd backend
node scripts/resetAdmin.js
```

### Session Security

The admin portal uses **`sessionStorage`** (not `localStorage`), so the session is cleared automatically when you close the browser tab or refresh. You must log in again each session — by design.

### Key Admin Workflows

**Adding a Coin:**
1. Manage Coins → Add Coin
2. Fill Basic Info (name, year, denomination, material, rarity)
3. Specifications (weight, diameter, mint)
4. Media — paste a public image URL (Imgur, Cloudinary, etc.)
5. Description + Historical Context
6. Save as Draft or Publish

**Replying to an Inquiry:**
1. Manage Inquiries → click `⋯` on any inquiry → Reply via Email
2. Edit the pre-filled subject and message
3. Click Send Email — real email is sent via Gmail SMTP
4. Status automatically updates to "Contacted"

**Marking as Featured:**
- Articles: `⋯` → Mark as Featured (appears in homepage featured section)
- Coins: `⋯` → Toggle Featured

---

## 🗂️ Data Models

### User
```
name, email, password (bcrypt), role (user|admin),
avatar, wishlist [→ Coin], createdAt
```

### Coin
```
name, year, denomination, era, ruler/leader, dynasty,
material (auto-lowercased), weight, diameter, rarity (1-5),
description, historicalContext, mintLocation/mint,
images[], imageUrl, views, featured, status (draft|published),
createdAt, updatedAt
```

### Article
```
title, slug (auto-generated), excerpt, content, coverImage,
author, category, tags[], views, featured, published,
status (draft|published), createdAt, updatedAt
```

### Inquiry
```
coinId → Coin, coinName, userId → User, userEmail, userName,
message, status (new|contacted|closed|pending|responded),
createdAt
```

### OTP
```
email, otp (6-digit), createdAt (TTL: 10 minutes auto-delete)
```

---

## 🌐 Deployment

### Backend (Render / Railway)

1. Connect your GitHub repo
2. Set **Build Command**: `npm install`
3. Set **Start Command**: `node server.js`
4. Add all environment variables from `backend/.env`
5. Set `FRONTEND_URL` to your deployed frontend URL(s)

### Frontend & Admin (Vercel / Netlify)

Both apps include `vercel.json` and `public/_redirects` for SPA routing.

**Vercel:**
1. Import repo, select `frontend` or `admin` as root directory
2. Framework: **Vite**
3. Add env vars (`VITE_API_URL` for frontend, `VITE_BACKEND_URL` for admin)

**Netlify:**
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Add env vars in Netlify dashboard

---

## 📸 Screenshots

| Page | Description |
|------|-------------|
| **Home** | Hero section with animated coins, featured collection, denomination browse grid |
| **Coin Catalog** | Filter sidebar with search (debounced), denomination, material, rarity, sort |
| **Coin Detail** | Full coin info, image gallery, inquiry dialog, related coins |
| **Articles** | Dynamic category filter, featured article, article grid |
| **Dashboard** | Profile management, wishlist, inquiry history |
| **Admin Dashboard** | Stats cards, most-viewed chart, era popularity, inquiry trends |
| **Admin Analytics** | Material distribution, rarity breakdown, inquiry status charts |
| **Manage Coins** | Sortable table, status filter, multi-step add/edit form |
| **Manage Inquiries** | Email reply dialog, status management, auto-delete on close |

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please ensure:
- Code follows existing style conventions
- Backend changes include proper error handling
- New routes are protected with appropriate middleware

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author

**Shivam Sharma**

[![GitHub](https://img.shields.io/badge/GitHub-ShivamSharma43-181717?style=flat-square&logo=github)](https://github.com/ShivamSharma43)
[![Email](https://img.shields.io/badge/Email-official.numisnest%40gmail.com-D14836?style=flat-square&logo=gmail)](mailto:official.numisnest@gmail.com)

---

<div align="center">

MADE WITH 🩷 BY **SHIVAM SHARMA**

⭐ Star this repo if you found it useful!

</div>
