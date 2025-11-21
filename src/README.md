# HackFest CRUD App

A **full-stack CRUD application** built with **Next.js (App Router)**, **TailwindCSS**, and **Supabase** (PostgreSQL + Auth) with **audit logging** and **server-side routes**. Deployed on **Vercel**.  

---

## 🏆 Features

### Authentication
- Signup / Login / Logout
- Persistent login via cookies (Supabase Auth)
- Protected routes for authenticated users

### Todos CRUD
- Create, Read, Update, Delete todos
- Todos are user-specific
- Form validation included

### Audit Logging
- Every Create, Update, Delete action recorded in `audit_logs` table
- Server-only routes using **Supabase service role key**
- Ensures tamper-proof activity tracking

### Frontend
- Responsive UI with **TailwindCSS**
- Dashboard listing all todos
- Todo creation & update forms
- Status toggle (completed/pending)

### Backend
- Supabase PostgreSQL database
- Row-Level Security (RLS) policies for user isolation
- Custom API routes for CRUD with audit logging

### Deployment
- Source hosted on GitHub
- Deployed on Vercel with environment variables

---

## 🛠 Tech Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, TailwindCSS  
- **Backend:** Supabase (PostgreSQL + Auth)  
- **Deployment:** Vercel  
- **State Management:** React Hooks  
- **Authentication:** Supabase Auth with cookies  

---

## 🚀 Getting Started

### Prerequisites

- Node.js 22.21.1
- npm 11.6.2
- PostgreSQL basics (Supabase DB)
- Git

Check versions:

```bash
node -v
npm -v
tsc -v
