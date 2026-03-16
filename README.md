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

2. Copy the example environment file and set your admin password:

```bash
cp .env.example .env.local
```

3. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

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

- Primary content lives in `data/siteData.json`
- Uploaded videos are stored in `public/uploads`
- Reviews are persisted inside `data/siteData.json`

---

## ✅ Build

```bash
npm run build
```

---

## 🎬 Customization

Update `data/siteData.json` or use the admin panel to edit:
- Bio and contact details
- Projects, experience, and software skills
- Video library and review collection
