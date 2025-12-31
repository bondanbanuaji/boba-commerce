# Boba-Commerce: Complete Local Setup Guide

> **Last Updated:** 2025-12-30  
> **Prerequisites:** Node.js 18+, npm/pnpm, Git, Supabase account

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Supabase Setup](#2-supabase-setup)
3. [Local Environment Setup](#3-local-environment-setup)
4. [Database Schema Implementation](#4-database-schema-implementation)
5. [Running the Application](#5-running-the-application)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. Prerequisites

### Required Software

| Software | Minimum Version | Installation |
|----------|----------------|--------------|
| **Node.js** | 18.0.0+ | [nodejs.org](https://nodejs.org) |
| **npm** | 9.0.0+ | Included with Node.js |
| **Git** | 2.0.0+ | [git-scm.com](https://git-scm.com) |

### Verify Installation

```bash
node --version   # Should show v18.0.0 or higher
npm --version    # Should show 9.0.0 or higher
git --version    # Should show 2.0.0 or higher
```

### Required Accounts

- **Supabase Account**: [supabase.com](https://supabase.com) (Free tier available)

---

## 2. Supabase Setup

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in project details:
   - **Name:** `boba-commerce` (or your preferred name)
   - **Database Password:** Create a strong password (save this!)
   - **Region:** Choose closest to your location
   - **Pricing Plan:** Free tier is sufficient for development

4. Click **"Create new project"** and wait ~2 minutes for provisioning

### Step 2: Get API Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values (you'll need these later):

```bash
# Project URL
PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co

# Anon/Public Key
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Service Role Key (KEEP SECRET!)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 3: Get Database Connection String

1. In Supabase dashboard, go to **Settings** → **Database**
2. Scroll to **Connection string** section
3. Select **URI** tab
4. Copy the connection string and replace `[YOUR-PASSWORD]` with your database password:

```bash
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
```

---

## 3. Local Environment Setup

### Step 1: Clone Repository

```bash
# Navigate to your projects directory
cd /media/boba/DATA/Project/js\ project/react/Astro/

# The repository is already cloned at:
cd boba-commerce
```

### Step 2: Install Dependencies

```bash
# Install all npm packages
npm install

# This will install:
# - Astro & integrations
# - React & React DOM
# - Tailwind CSS
# - Drizzle ORM & Drizzle Kit
# - Supabase client
# - Nanostores
# - Other dependencies
```

**Expected output:**
```
added 847 packages, and audited 848 packages in 45s
```

### Step 3: Create Environment File

```bash
# Copy the example environment file
cp .env.example .env
```

### Step 4: Configure Environment Variables

Edit the `.env` file with your Supabase credentials:

```bash
# Open in your preferred editor
nano .env
# or
code .env
```

Add your Supabase credentials:

```bash
# Supabase Configuration
PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Database Connection (for Drizzle ORM)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres

# Optional: Service Role Key (for admin operations)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ IMPORTANT:** Never commit the `.env` file to Git! It's already in `.gitignore`.

---

## 4. Database Setup

### Step 1: Run Migrations

The database schema is already implemented in `src/lib/db/schema/`. You just need to push it to your Supabase project.

```bash
# Push schema to database
npm run db:push

# Expected output:
# [✓] Changes applied
```

### Step 2: Seed Initial Data (Optional)

Populate the database with initial products, categories, and customization options.

```bash
# Run seed script
npm run db:seed

# Expected output:
# 🌱 Starting database seed...
#   📝 Seeding customization options...
#   📁 Seeding categories...
#   🧋 Seeding products...
# 🎉 Database seeding completed successfully!
```

### Step 3: Verify Database

1. Go to Supabase dashboard → **Table Editor**
2. You should see the following tables:
   - `users`
   - `categories`
   - `products`
   - `product_variants`
   - `product_images`
   - `customization_options`
   - `cart_items`
   - `addresses`
   - `orders`
   - `order_items`
   - `order_item_customizations`
   - `payments`

### Available Database Commands

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Generate SQL migrations from schema files |
| `npm run db:push` | Push schema changes directly to database (prototyping) |
| `npm run db:migrate` | Apply generated migrations to database (production) |
| `npm run db:studio` | Open Drizzle Studio to view/edit data |
| `npm run db:seed` | Seed database with initial data |

## 5. Running the Application

### Development Server

```bash
# Start the development server
npm run dev

# Expected output:
# 🚀 astro v5.16.6 started in XXms
# 
# ┃ Local    http://localhost:4321/
# ┃ Network  use --host to expose
```

### Access the Application

Open your browser and navigate to:
- **Local:** http://localhost:4321
- **Network:** http://192.168.x.x:4321 (if using `--host` flag)

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 4321) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run db:generate` | Generate database migrations |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open Drizzle Studio (database GUI) |
| `npm run db:seed` | Seed database with initial data |

---

## 6. Troubleshooting

### Issue: "Cannot find module '@lib/db/client'"

**Cause:** Database client file not created or schema not implemented.

**Solution:**
1. Complete [Step 4: Database Schema Implementation](#4-database-schema-implementation)
2. Ensure `src/lib/db/client.ts` exists
3. Restart development server

---

### Issue: "DATABASE_URL environment variable is not set"

**Cause:** Environment variables not configured.

**Solution:**
1. Ensure `.env` file exists in project root
2. Verify `DATABASE_URL` is set correctly
3. Restart development server (environment variables are loaded on startup)

---

### Issue: "Failed to connect to database"

**Cause:** Invalid database credentials or network issues.

**Solution:**
1. Verify Supabase project is running (check dashboard)
2. Check `DATABASE_URL` format:
   ```
   postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
3. Ensure password doesn't contain special characters (URL encode if needed)
4. Check firewall/network settings

---

### Issue: "Migrations failed to run"

**Cause:** Schema errors or database connection issues.

**Solution:**
1. Check schema files for syntax errors
2. Ensure all imports are correct
3. Try generating migrations again:
   ```bash
   rm -rf drizzle/migrations
   npm run db:generate
   npm run db:push
   ```

---

### Issue: "Port 4321 already in use"

**Cause:** Another process is using port 4321.

**Solution:**
1. Find and kill the process:
   ```bash
   lsof -ti:4321 | xargs kill -9
   ```
2. Or use a different port:
   ```bash
   npm run dev -- --port 3000
   ```

---

### Issue: "Module not found" errors

**Cause:** Dependencies not installed or path aliases not configured.

**Solution:**
1. Reinstall dependencies:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
2. Verify TypeScript path aliases in `tsconfig.json`
3. Restart development server

---

## Next Steps

After completing local setup:

1. ✅ Verify homepage loads at http://localhost:4321
2. ✅ Check browser console for errors
3. ✅ Test cart functionality (add/remove items)
4. ✅ Test authentication (login/register)
5. 📖 Proceed to [Vercel Deployment Guide](file:///media/boba/DATA/Project/js%20project/react/Astro/boba-commerce/docs/setup/02-vercel-deployment.md)

---

## Support

For issues or questions:
- Check [Architecture Documentation](file:///media/boba/DATA/Project/js%20project/react/Astro/boba-commerce/docs/plan/01-frontend-architecture.md)
- Review [Backend Architecture](file:///media/boba/DATA/Project/js%20project/react/Astro/boba-commerce/docs/plan/02-backend-architecture.md)
- Check Astro documentation: [docs.astro.build](https://docs.astro.build)
- Check Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
