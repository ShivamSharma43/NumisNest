# NumisNest Backend

## Setup & Run

```bash
npm install
npm run dev       # development
npm start         # production
```

## Environment Variables (.env)
```
PORT=5000
MONGODB_URI=<your MongoDB Atlas URI>
JWT_SECRET=<strong secret string>
JWT_EXPIRE=7d
ADMIN_EMAIL=<admin login email>
ADMIN_PASSWORD=<admin login password>
CLOUDINARY_API_KEY=<key>
CLOUDINARY_SECRET_KEY=<secret>
CLOUDINARY_NAME=<cloud name>
FRONTEND_URL=<your deployed frontend URL>
```

## Deployment (Render / Railway)
- Build Command: `npm install`
- Start Command: `node server.js`
- Add all `.env` variables in the platform's environment settings

## API Routes
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | – | Register user |
| POST | /api/auth/login | – | Login |
| GET | /api/auth/profile | user | Get profile |
| PUT | /api/auth/profile | user | Update profile |
| PUT | /api/auth/change-password | user | Change password |
| GET | /api/coins | – | List coins |
| GET | /api/coins/featured | – | Featured coins |
| GET | /api/coins/:id | – | Single coin |
| GET | /api/coins/:id/related | – | Related coins |
| POST | /api/coins/:id/views | – | Increment views |
| GET | /api/wishlist | user | Get wishlist |
| POST | /api/wishlist | user | Add to wishlist |
| DELETE | /api/wishlist/:coinId | user | Remove from wishlist |
| GET | /api/inquiries | user | Get user inquiries |
| POST | /api/inquiries | user | Create inquiry |
| DELETE | /api/inquiries/:id | user | Cancel inquiry |
| GET | /api/articles | – | List articles |
| GET | /api/articles/featured | – | Featured articles |
| GET | /api/articles/categories | – | Categories |
| GET | /api/articles/:id | – | Single article |
| POST | /api/articles/:id/views | – | Increment views |
| GET | /api/admin/dashboard/stats | admin | Dashboard stats |
| POST | /api/admin/coins | admin | Create coin |
| PUT | /api/admin/coins/:id | admin | Update coin |
| DELETE | /api/admin/coins/:id | admin | Delete coin |
| POST | /api/admin/articles | admin | Create article |
| PUT | /api/admin/articles/:id | admin | Update article |
| DELETE | /api/admin/articles/:id | admin | Delete article |
| GET | /api/admin/inquiries | admin | All inquiries |
| PATCH | /api/admin/inquiries/:id/status | admin | Update inquiry status |
