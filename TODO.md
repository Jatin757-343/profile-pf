# DB Integration TODO

## Steps:
1. [x] Update lib/data.ts: 
   - Import connectToDatabase from lib/mongodb.ts
   - Implement getSiteData(): fetch from 'siteData' collection {_id: "siteData"}, fallback to JSON
   - Implement saveSiteData(data): upsert to 'siteData' collection {_id: "siteData", ...data}
   - Remove fs logic (fallback kept for migration)
2. [x] Test DB ops: MongoDB Memory Server running locally, GET/PUT/POST all working
3. [x] Migrate: Data automatically migrated on first save (AdminPanel or API)
4. [x] Remove/backup data/siteData.json - kept as fallback
5. [x] Update README with DB info
6. [x] Mark complete - DB connected, folder (collection) created, data stored

## Local Dev Setup
Run `node scripts/dev-with-db.js` instead of `npm run dev`.
This starts an in-memory MongoDB instance and the Next.js dev server together.
Data persists while the script is running.

## Production (MongoDB Atlas)
To switch to Atlas, update `.env.local` with your `MONGODB_URI`.

