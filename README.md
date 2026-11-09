# Expense Tracker

A MERN app for logging income and expenses, setting monthly budgets per category, and seeing where your money goes.

- **Backend:** Node, Express 5, MongoDB (Mongoose), Zod validation, JWT auth (`server/`)
- **Frontend:** React 19, Vite, Tailwind CSS 4, TanStack Query, Zustand, Recharts (`client/`)

## Run locally

Requires Node 20+ and MongoDB running on `127.0.0.1:27017`.

```bash
cp .env.example .env
npm install
npm install --prefix client
npm run seed
npm run dev
```

- App: http://localhost:5173
- API: http://localhost:5000/api

`npm run seed` creates the demo account **demo@example.com / demo1234** with a few sample transactions and budgets. In development the login form is pre-filled with it.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts the API (nodemon) and the client (Vite) together |
| `npm run seed` | Resets the demo account to a few sample transactions and budgets |
| `npm run build` | Installs client packages and builds the client into `client/dist` |
| `npm start` | Starts the API; with `NODE_ENV=production` it also serves `client/dist` |

## API

All routes except `/auth/register`, `/auth/login`, `/health` and `/categories` need an `Authorization: Bearer <token>` header.

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Current user |
| GET | `/api/categories` | Income and expense categories |
| GET | `/api/transactions?month=YYYY-MM&type=&category=&limit=` | List transactions |
| POST / PUT / DELETE | `/api/transactions[/:id]` | Create, update, delete |
| GET | `/api/budgets?month=YYYY-MM` | Budgets with amount spent |
| POST / PUT / DELETE | `/api/budgets[/:id]` | Create, update, delete |
| GET | `/api/summary?month=YYYY-MM` | Totals, spending by category, last 6 months |
