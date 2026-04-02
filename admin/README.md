# NumisNest Admin Panel

## Setup & Run
```bash
npm install
npm run dev     # development (port 8081)
npm run build   # production build
```

## Environment Variables (.env)
```
VITE_BACKEND_URL=https://your-backend-url.com/api
```

## Default Admin Login
Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in your backend `.env`.
The admin account is auto-created on first backend startup.

## Deploy to Vercel
1. Push to GitHub
2. Import repo in Vercel
3. Framework: Vite
4. Add env var: `VITE_BACKEND_URL=https://your-backend.com/api`
5. Deploy
