# MR Starter Lite
 
+ ![License](https://img.shields.io/badge/license-MIT-blue)
+ ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
+ ![GitHub Stars](https://img.shields.io/github/stars/matheusregis/mr-starter-lite)
+ ![GitHub Release](https://img.shields.io/github/v/release/matheusregis/mr-starter-lite)

  
> The free, open-source foundation for your micro-SaaS.  
> Clone it, configure it, and have working authentication in minutes.

---

## ⚠️ This is the Lite version

MR Starter comes in two versions:

| Feature                                                  | Lite (free) | Full (paid)           |
| -------------------------------------------------------- | ----------- | --------------------- |
| NestJS + Next.js structure                               | ✅          | ✅                    |
| Login / Register / Logout                                | ✅ Basic    | ✅ Complete           |
| JWT Authentication                                       | ✅          | ✅ + Refresh Token    |
| Docker (dev)                                             | ✅          | ✅ + Production ready |
| Unit tests                                               | ✅ Basic    | ✅ Complete + E2E     |
| Email verification                                       | ❌          | ✅                    |
| Password reset                                           | ❌          | ✅                    |
| OAuth (Google / GitHub)                                  | ❌          | ✅                    |
| Roles / RBAC                                             | ❌          | ✅                    |
| Multi-database (MongoDB, PostgreSQL, Firebase, Supabase) | ❌          | ✅ coming soon        |
| Billing (Stripe / PagSeguro)                             | ❌          | ✅ coming soon        |
| Full documentation                                       | ❌          | ✅                    |
| Discord community                                        | ❌          | ✅                    |
| Support & updates                                        | ❌          | ✅ 12 months          |

### About the Lite version

**The Lite version receives minimal maintenance.** It is provided as-is — critical bugs may be addressed eventually, but there are no guarantees of fixes, updates, or response time.

**Support is not included in the Lite version.** If you need help, active support, access to the Discord community, or guaranteed maintenance, that is available exclusively in the Full version.

> ⚠️ **Important:** Support in the Full version covers usage of the boilerplate itself. It is not a consulting or advisory service. If you need personalized consulting or custom development, that is a separate engagement at a different price.

> 👉 Interested in the Full version? See the [Waitlist](#waitlist) section below.

---

## Who Is This For

✅ Developers who want a clean NestJS + Next.js starting point  
✅ Solo devs validating an MVP fast  
✅ Anyone tired of setting up auth from scratch

❌ Not for absolute beginners  
❌ Not a finished product  
❌ Does not include business logic

---

## What's Included

### Backend (NestJS + MongoDB)

- Login, register, logout
- JWT authentication
- Structured logs (Pino)
- Environment validation on startup (Zod)
- Docker with hot-reload

### Frontend (Next.js)

- Login and register pages
- Protected route (dashboard)
- Full integration with the backend

---

## Prerequisites

| Tool               | Version | Purpose                |
| ------------------ | ------- | ---------------------- |
| **Docker**         | 20.10+  | Run all services       |
| **Docker Compose** | 2.0+    | Orchestrate containers |
| **Node.js**        | 20+     | Run locally (optional) |
| **Git**            | Any     | Clone the repo         |

---

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/matheusregis/mr-starter-lite
cd mr-starter-lite
```

### 2. Configure environment

```bash
cp backend/.env.example backend/.env
```

Open `backend/.env` and fill in the required values:

```env
JWT_SECRET=any-random-string-with-at-least-32-characters
```

Generate a secure secret:

```bash
# Mac/Linux
openssl rand -hex 32

# Windows (PowerShell)
[System.Web.Security.Membership]::GeneratePassword(32, 0)
```

### 3. Start the services

```bash
docker compose -f docker-compose.dev.yml up
```

### 4. Access the application

```
http://localhost:3000   → Frontend
http://localhost:3001   → Backend API
```

---

## Running Locally (without Docker)

If you prefer to run backend and frontend directly on your machine:

### 1. Start MongoDB only

```bash
docker compose -f docker-compose.mongo.yml up -d
```

### 2. Start the backend

```bash
cd backend
yarn install
yarn start:dev
```

### 3. Start the frontend

```bash
cd frontend
yarn install
yarn dev
```

---

## Running Tests

```bash
# Backend
cd backend
yarn test

# Frontend
cd frontend
yarn test
```

---

## Waitlist

The **Full version** is in active development and will include:

- ✅ OAuth (Google + GitHub)
- ✅ Email verification + password reset
- ✅ Roles / RBAC
- ✅ Multi-database support (MongoDB, PostgreSQL, Firebase, Supabase)
- ✅ Billing integration (Stripe + PagSeguro)
- ✅ Full documentation
- ✅ Discord community access
- ✅ Support & updates for 12 months

**Want to be the first to know when it launches?**

1. ⭐ **Star this repo** — it helps the project grow
2. 👤 **Follow [@matheusregis](https://github.com/matheusregis)** on GitHub
3. 💬 **Join the Discord** — launch announcements, early access, and updates will be posted there first _(Discord link coming soon — this week)_

---

## License

MIT — free to use in personal and commercial projects.

---

Stop wasting time on setup. Start building what actually matters.





