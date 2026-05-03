# AURA Full Stack Platform

AURA is a premium full stack learning platform starter built with:

- Frontend: React + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB Atlas
- Auth: JWT + bcryptjs
- Payments: Razorpay-ready checkout flow with demo fallback
- AI Chatbot: OpenAI or Gemini with demo fallback
- Hosting target: Vercel (frontend) + Render (backend)

## Project Structure

```txt
AURA/
  aura-frontend/
    src/
      auth/
      components/
      context/
      pages/
      services/
  aura-backend/
    config/
    controllers/
    data/
    middleware/
    models/
    routes/
    utils/
```

## Included Features

- Premium login/register experience
- Role-based auth for `admin`, `student`, and `staff`
- Dashboard overview per role
- Courses management APIs and UI
- Materials/videos management using hosted URLs
- Payment checkout + verification flow
- AI chatbot endpoint and UI
- Report summary + PDF export using print flow
- MongoDB Atlas-ready schemas for all requested collections
- Demo data fallback when MongoDB is not configured

## MongoDB Collections

The backend includes models for:

- `users`
- `courses`
- `enrollments`
- `payments`
- `materials`
- `chatbot_logs`
- `notifications`

## Local Setup

### 1. Backend

```powershell
cd aura-backend
Copy-Item .env.example .env
npm install
npm start
```

Backend environment values:

- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_URL`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `OPENAI_API_KEY` or `GEMINI_API_KEY`

If `MONGO_URI` is missing, the backend runs in demo mode with seeded users and courses.

### 2. Frontend

```powershell
cd aura-frontend
Copy-Item .env.example .env
npm install
npm start
```

Frontend environment values:

- `REACT_APP_API_URL=http://localhost:5000/api`

## Demo Credentials

When running in backend demo mode:

- Admin: `admin@aura.dev` / `Aura@123`
- Student: `student@aura.dev` / `Aura@123`
- Staff: `staff@aura.dev` / `Aura@123`

## Deployment Guide

### Frontend on Vercel

1. Import `aura-frontend` as a Vercel project.
2. Set `REACT_APP_API_URL` to your Render backend URL plus `/api`.
3. Build command: `npm run build`
4. Output directory: `build`

### Backend on Render

1. Import `aura-backend` as a Web Service.
2. Start command: `npm start`
3. Add environment variables from `.env.example`
4. Set `CLIENT_URL` to the Vercel frontend domain
5. Add your MongoDB Atlas connection string in `MONGO_URI`

### MongoDB Atlas

1. Create a cluster and database named `aura`
2. Add a database user
3. Allow your Render IP or use trusted access settings
4. Paste the connection string into `MONGO_URI`

## Notes

- The payment flow is structured for Razorpay but currently uses a demo-ready checkout object until live credentials and provider verification are added.
- Materials upload is currently URL-based to avoid adding file storage dependencies in the first version.
- PDF export is handled through the browser print dialog from the report section.
