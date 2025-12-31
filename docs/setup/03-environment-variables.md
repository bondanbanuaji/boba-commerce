# Boba-Commerce: Environment Variables Reference

> **Last Updated:** 2025-12-30  
> **Purpose:** Complete reference for all environment variables

---

## Required Variables

### Supabase Configuration

```bash
# Supabase Project URL
# Location: Supabase Dashboard → Settings → API → Project URL
# Example: https://abcdefghijklmnop.supabase.co
PUBLIC_SUPABASE_URL=

# Supabase Anonymous/Public Key
# Location: Supabase Dashboard → Settings → API → Project API keys → anon/public
# This key is safe to use in client-side code
PUBLIC_SUPABASE_ANON_KEY=

# Database Connection String
# Location: Supabase Dashboard → Settings → Database → Connection string → URI
# Format: postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
# Replace [PASSWORD] with your database password
DATABASE_URL=
```

---

## Optional Variables

### Supabase Service Role Key

```bash
# Supabase Service Role Key (KEEP SECRET!)
# Location: Supabase Dashboard → Settings → API → Project API keys → service_role
# ⚠️ WARNING: This key bypasses Row Level Security. Never expose to client!
# Use only for server-side admin operations
SUPABASE_SERVICE_ROLE_KEY=
```

### Application Configuration

```bash
# Site URL (for production)
# Your production domain
PUBLIC_SITE_URL=https://yourdomain.com

# Node Environment
# Options: development, production, test
NODE_ENV=development
```

### Analytics & Monitoring (Optional)

```bash
# Vercel Analytics
VERCEL_ANALYTICS_ID=

# Sentry Error Tracking
SENTRY_DSN=

# Google Analytics
GA_TRACKING_ID=
```

---

## Environment-Specific Configuration

### Development (.env.local)

```bash
# Supabase
PUBLIC_SUPABASE_URL=https://your-dev-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-dev-anon-key
DATABASE_URL=postgresql://postgres:password@db.your-dev-project.supabase.co:5432/postgres

# Optional
SUPABASE_SERVICE_ROLE_KEY=your-dev-service-role-key
PUBLIC_SITE_URL=http://localhost:4321
NODE_ENV=development
```

### Production (Vercel)

```bash
# Supabase (Production Project)
PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-prod-anon-key
DATABASE_URL=postgresql://postgres:password@db.your-prod-project.supabase.co:5432/postgres

# Optional
SUPABASE_SERVICE_ROLE_KEY=your-prod-service-role-key
PUBLIC_SITE_URL=https://yourdomain.com
NODE_ENV=production
```

---

## Security Guidelines

### ✅ DO

- ✅ Use different Supabase projects for development and production
- ✅ Rotate `SUPABASE_SERVICE_ROLE_KEY` regularly
- ✅ Add `.env` to `.gitignore` (already done)
- ✅ Use `PUBLIC_` prefix only for client-safe variables
- ✅ Store sensitive keys in Vercel environment variables
- ✅ Use strong, unique database passwords

### ❌ DON'T

- ❌ Commit `.env` files to Git
- ❌ Share `SUPABASE_SERVICE_ROLE_KEY` publicly
- ❌ Use production credentials in development
- ❌ Expose sensitive keys to client-side code
- ❌ Use simple or default passwords

---

## Variable Naming Convention

| Prefix | Visibility | Example |
|--------|-----------|---------|
| `PUBLIC_` | Client-side accessible | `PUBLIC_SUPABASE_URL` |
| No prefix | Server-side only | `DATABASE_URL` |
| `VERCEL_` | Vercel-specific | `VERCEL_ANALYTICS_ID` |

---

## Validation

### Check Required Variables

Create a validation script to ensure all required variables are set:

```typescript
// src/lib/utils/env-check.ts
const requiredEnvVars = [
  'PUBLIC_SUPABASE_URL',
  'PUBLIC_SUPABASE_ANON_KEY',
  'DATABASE_URL',
];

export function validateEnv() {
  const missing = requiredEnvVars.filter(
    (varName) => !import.meta.env[varName]
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}
```

### Runtime Type Checking

```typescript
// src/env.d.ts
interface ImportMetaEnv {
  readonly PUBLIC_SUPABASE_URL: string;
  readonly PUBLIC_SUPABASE_ANON_KEY: string;
  readonly DATABASE_URL: string;
  readonly SUPABASE_SERVICE_ROLE_KEY?: string;
  readonly PUBLIC_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

---

## Troubleshooting

### Issue: "Environment variable not defined"

**Solution:**
1. Ensure `.env` file exists in project root
2. Verify variable names match exactly (case-sensitive)
3. Restart development server after changes
4. For Vercel, add variables in dashboard and redeploy

### Issue: "Cannot connect to database"

**Solution:**
1. Verify `DATABASE_URL` format is correct
2. Ensure password doesn't contain special characters (URL encode if needed)
3. Check Supabase project is running
4. Test connection using Drizzle Studio: `npm run db:studio`

### Issue: "Supabase client initialization failed"

**Solution:**
1. Verify `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` are set
2. Ensure URL includes `https://` protocol
3. Check keys are copied correctly (no extra spaces)
4. Restart development server

---

## Quick Setup

### 1. Copy Example File

```bash
cp .env.example .env
```

### 2. Fill in Values

Edit `.env` and replace placeholders:

```bash
PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
```

### 3. Verify

```bash
# Start development server
npm run dev

# If no errors, environment is configured correctly
```

---

## Reference Links

- **Supabase API Settings**: [app.supabase.com/project/_/settings/api](https://app.supabase.com/project/_/settings/api)
- **Supabase Database Settings**: [app.supabase.com/project/_/settings/database](https://app.supabase.com/project/_/settings/database)
- **Vercel Environment Variables**: [vercel.com/docs/concepts/projects/environment-variables](https://vercel.com/docs/concepts/projects/environment-variables)
