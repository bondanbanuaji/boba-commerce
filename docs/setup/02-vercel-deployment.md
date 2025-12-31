# Boba-Commerce: Vercel Deployment Guide

> **Last Updated:** 2025-12-30  
> **Prerequisites:** Completed local setup, Vercel account, GitHub repository

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Prepare for Deployment](#2-prepare-for-deployment)
3. [Deploy to Vercel](#3-deploy-to-vercel)
4. [Configure Environment Variables](#4-configure-environment-variables)
5. [Post-Deployment Setup](#5-post-deployment-setup)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. Prerequisites

### Required Accounts
- ✅ **GitHub Account**: [github.com](https://github.com)
- ✅ **Vercel Account**: [vercel.com](https://vercel.com) (sign up with GitHub)
- ✅ **Supabase Project**: Already configured from local setup

### Pre-Deployment Checklist
- [ ] Application runs successfully locally (`npm run dev`)
- [x] Database schema is implemented and migrated
- [ ] All environment variables are configured in `.env`
- [ ] Code is committed to Git repository
- [ ] Repository is pushed to GitHub

---

## 2. Prepare for Deployment

### Step 1: Verify Build Locally

Before deploying, ensure the production build works:

```bash
# Build the application
npm run build

# Expected output:
# ✓ Built in XXXms
# ✓ Completed in XXXs.
```

If the build fails, fix errors before proceeding.

### Step 2: Preview Production Build

```bash
# Preview the production build
npm run preview

# Expected output:
# Preview server running at http://localhost:4321
```

Test the preview to ensure everything works correctly.

### Step 3: Push to GitHub

If you haven't already, push your code to GitHub:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Boba Commerce application"

# Add GitHub remote (replace with your repository URL)
git remote add origin https://github.com/YOUR_USERNAME/boba-commerce.git

# Push to GitHub
git push -u origin main
```

---

## 3. Deploy to Vercel

### Step 1: Import Project to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New..."** → **"Project"**
3. Select your GitHub repository: `boba-commerce`
4. Click **"Import"**

### Step 2: Configure Project Settings

Vercel will auto-detect Astro. Verify the following settings:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Astro |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |
| **Node.js Version** | 18.x (or higher) |

> **Note:** These settings are already configured in `vercel.json`, so Vercel should auto-detect them.

### Step 3: Configure Build Settings

Click **"Environment Variables"** and add the following:

```bash
# Supabase Configuration
PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Database Connection
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres

# Optional: Service Role Key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> **⚠️ IMPORTANT:** 
> - Use the **SAME** values from your local `.env` file
> - Mark `SUPABASE_SERVICE_ROLE_KEY` as **"Sensitive"** if available
> - Variables prefixed with `PUBLIC_` will be exposed to the client

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (~2-3 minutes)
3. Once complete, you'll see: **"Your project has been deployed!"**

---

## 4. Configure Environment Variables

### Verify Environment Variables

1. In Vercel dashboard, go to **Settings** → **Environment Variables**
2. Ensure all variables are set for **Production**, **Preview**, and **Development**:

| Variable | Production | Preview | Development |
|----------|-----------|---------|-------------|
| `PUBLIC_SUPABASE_URL` | ✅ | ✅ | ✅ |
| `PUBLIC_SUPABASE_ANON_KEY` | ✅ | ✅ | ✅ |
| `DATABASE_URL` | ✅ | ✅ | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | ✅ | ✅ |

### Add Additional Variables (Optional)

For production, you may want to add:

```bash
# Analytics (optional)
VERCEL_ANALYTICS_ID=your_analytics_id

# Error Tracking (optional)
SENTRY_DSN=your_sentry_dsn

# Custom Domain (if applicable)
PUBLIC_SITE_URL=https://yourdomain.com
```

---

## 5. Post-Deployment Setup

### Step 1: Verify Deployment

1. Click on your deployment URL (e.g., `https://boba-commerce.vercel.app`)
2. Verify the following:
   - [ ] Homepage loads correctly
   - [ ] Images and assets load
   - [ ] Navigation works
   - [ ] Cart functionality works
   - [ ] Authentication works (login/register)

### Step 2: Configure Supabase for Production

1. Go to Supabase dashboard → **Authentication** → **URL Configuration**
2. Add your Vercel deployment URL to **Site URL**:
   ```
   https://boba-commerce.vercel.app
   ```

3. Add to **Redirect URLs**:
   ```
   https://boba-commerce.vercel.app/auth/callback
   https://boba-commerce.vercel.app/**
   ```

### Step 3: Set Up Custom Domain (Optional)

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Click **"Add"**
3. Enter your custom domain (e.g., `bobashop.com`)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (~24-48 hours)

### Step 4: Configure Production Database (Recommended)

For production, consider using a separate Supabase project:

1. Create a new Supabase project for production
2. Run migrations on the production database:
   ```bash
   # Set production DATABASE_URL temporarily
   export DATABASE_URL="postgresql://postgres:[PROD-PASSWORD]@db.[PROD-REF].supabase.co:5432/postgres"
   
   # Run migrations
   npm run db:push
   
   # Seed production data
   npm run db:seed
   ```

3. Update Vercel environment variables with production Supabase credentials

---

## 6. Troubleshooting

### Issue: Build Failed - "Cannot find module"

**Cause:** Missing dependencies or incorrect imports.

**Solution:**
1. Check Vercel build logs for specific error
2. Ensure all dependencies are in `package.json` (not `devDependencies` if needed at runtime)
3. Verify import paths are correct
4. Redeploy:
   ```bash
   git add .
   git commit -m "Fix build errors"
   git push
   ```

---

### Issue: "Environment variable not defined"

**Cause:** Environment variables not set in Vercel.

**Solution:**
1. Go to Vercel dashboard → **Settings** → **Environment Variables**
2. Add missing variables
3. Redeploy (Vercel will automatically redeploy after adding env vars)

---

### Issue: Database Connection Failed

**Cause:** Invalid `DATABASE_URL` or Supabase project not accessible.

**Solution:**
1. Verify `DATABASE_URL` in Vercel matches Supabase connection string
2. Check Supabase project is running
3. Ensure database password is correct (no special characters or URL encode them)
4. Check Supabase **Database** → **Connection pooling** is enabled

---

### Issue: Authentication Not Working

**Cause:** Redirect URLs not configured in Supabase.

**Solution:**
1. Go to Supabase → **Authentication** → **URL Configuration**
2. Add Vercel deployment URL to **Redirect URLs**:
   ```
   https://your-app.vercel.app/auth/callback
   https://your-app.vercel.app/**
   ```
3. Clear browser cache and try again

---

### Issue: Images Not Loading

**Cause:** Image optimization or incorrect paths.

**Solution:**
1. Ensure images are in `public/` directory
2. Use absolute paths: `/images/photo.jpg` (not `./images/photo.jpg`)
3. For external images, ensure URLs are accessible
4. Check Vercel **Image Optimization** settings

---

### Issue: Slow Performance

**Cause:** Unoptimized build or large bundle size.

**Solution:**
1. Enable Vercel Analytics to identify bottlenecks
2. Optimize images (use WebP format)
3. Enable ISR (Incremental Static Regeneration) for product pages
4. Review bundle size:
   ```bash
   npm run build -- --verbose
   ```

---

## Continuous Deployment

### Automatic Deployments

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update product page"
git push

# Vercel will automatically:
# 1. Detect the push
# 2. Build the project
# 3. Deploy to production
```

### Preview Deployments

For pull requests, Vercel creates preview deployments:

1. Create a new branch:
   ```bash
   git checkout -b feature/new-feature
   ```

2. Make changes and push:
   ```bash
   git add .
   git commit -m "Add new feature"
   git push origin feature/new-feature
   ```

3. Create a pull request on GitHub
4. Vercel will create a preview deployment with a unique URL

### Rollback Deployments

If a deployment has issues:

1. Go to Vercel dashboard → **Deployments**
2. Find a previous working deployment
3. Click **"..."** → **"Promote to Production"**

---

## Performance Optimization

### Enable Edge Functions

For better performance, enable Vercel Edge Functions:

```javascript
// astro.config.mjs
export default defineConfig({
  output: 'server',
  adapter: vercel({
    edgeMiddleware: true, // Enable edge middleware
  }),
});
```

### Enable ISR for Product Pages

```javascript
// astro.config.mjs
export default defineConfig({
  adapter: vercel({
    isr: {
      expiration: 60 * 60, // 1 hour cache
    },
  }),
});
```

### Enable Image Optimization

Vercel automatically optimizes images. Ensure you're using the Vercel image service:

```javascript
// astro.config.mjs
export default defineConfig({
  adapter: vercel({
    imageService: true, // Already enabled
  }),
});
```

---

## Monitoring & Analytics

### Vercel Analytics

1. Go to Vercel dashboard → **Analytics**
2. Click **"Enable Analytics"**
3. Analytics will track:
   - Page views
   - Performance metrics (Core Web Vitals)
   - User geography

### Vercel Speed Insights

1. Install Speed Insights:
   ```bash
   npm install @vercel/speed-insights
   ```

2. Add to your layout:
   ```astro
   ---
   // src/layouts/BaseLayout.astro
   import { SpeedInsights } from '@vercel/speed-insights/astro';
   ---
   
   <html>
     <body>
       <slot />
       <SpeedInsights />
     </body>
   </html>
   ```

---

## Security Best Practices

### Environment Variables

- ✅ Never commit `.env` to Git
- ✅ Use `PUBLIC_` prefix only for client-safe variables
- ✅ Rotate `SUPABASE_SERVICE_ROLE_KEY` regularly
- ✅ Use different Supabase projects for dev/staging/production

### HTTPS & Security Headers

Vercel automatically provides:
- ✅ HTTPS/SSL certificates
- ✅ Security headers (configured in `vercel.json`)
- ✅ DDoS protection

### Database Security

- ✅ Enable Row Level Security (RLS) in Supabase
- ✅ Use connection pooling for better performance
- ✅ Regularly backup database

---

## Next Steps

After successful deployment:

1. ✅ Test all functionality on production URL
2. ✅ Set up custom domain (optional)
3. ✅ Enable analytics and monitoring
4. ✅ Configure error tracking (Sentry, etc.)
5. ✅ Set up CI/CD for automated testing
6. 📖 Review [Maintenance Guide](file:///media/boba/DATA/Project/js%20project/react/Astro/boba-commerce/docs/setup/03-maintenance.md)

---

## Support Resources

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Astro Deployment**: [docs.astro.build/en/guides/deploy/vercel](https://docs.astro.build/en/guides/deploy/vercel)
- **Supabase Production**: [supabase.com/docs/guides/platform/going-into-prod](https://supabase.com/docs/guides/platform/going-into-prod)
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
