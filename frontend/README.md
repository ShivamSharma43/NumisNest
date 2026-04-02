# NumisNest Frontend

## Setup & Run
```bash
npm install
npm run dev     # development (port 8080)
npm run build   # production build
```

## Environment Variables (.env)
```
VITE_API_URL=https://your-backend-url.com/api
VITE_APP_NAME=NumisNest
VITE_USE_MOCK_FALLBACK=false
VITE_DEV_MODE=false
VITE_ITEMS_PER_PAGE=12
```

## Deploy to Vercel
1. Push to GitHub
2. Import repo in Vercel
3. Framework: Vite
4. Add env var: `VITE_API_URL=https://your-backend.com/api`
5. Deploy

## Deploy to Netlify
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Add env vars in Netlify dashboard
4. `_redirects` file is already included for SPA routing
