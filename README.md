# Video Editor Portfolio Website

A full-stack portfolio site built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**, designed to showcase your bio, projects, software tools, client reviews, and video library.

## ✅ Features

- **Bio + About section** with your contact details
- **Project showcase** (editable from admin panel)
- **Video library** with a watch-and-rate experience
- **Ratings & reviews** collected after clients watch a video
- **Admin panel** for editing content and uploading videos
- Black & white professional theme with smooth transitions

---

## 🚀 Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run with local MongoDB (in-memory):

```bash
node scripts/dev-with-db.js
```

This starts a temporary MongoDB instance and the Next.js dev server together. Open [http://localhost:3000](http://localhost:3000) to view the site.

3. Or run directly (requires working `MONGODB_URI` in `.env.local`):

```bash
npm run dev
```

---

## 🔐 Admin Panel

Visit `/admin` to access the admin dashboard.

- Default password (if not set in `.env.local`): `admin123`
- From the admin panel you can:
  - Edit your **Bio** (name, title, tagline, about, contact info, social links)
  - Manage **Projects** (add/remove projects with title, description, tags, video links)
  - Update **Experience** (add/remove work history with roles, companies, periods, descriptions, highlights)
  - Edit **Softwares** (add/remove tools you use with names and descriptions)
  - Manage **Videos** (add/remove video entries for the library)
  - **Upload new videos** (stored in `/public/uploads` and automatically added to the video library)

---

## 🗂️ Data Storage

**Primary: MongoDB** (`videoeditor` DB, `siteData` collection):
- Content (bio, projects, videos, reviews etc.) stored in MongoDB.
- Local dev uses `mongodb-memory-server` (auto-started by `scripts/dev-with-db.js`).
- Production: set `MONGODB_URI` in `.env.local` pointing to MongoDB Atlas or your own server.
- Fallback: `data/siteData.json` is used if the DB is unreachable.

**Uploaded videos**: `public/uploads`.

---

## ✅ Build

```bash
npm run build
```

---

## 🎬 Customization

Use the admin panel to edit:
- Bio and contact details
- Projects, experience, and software skills
- Video library and review collection

