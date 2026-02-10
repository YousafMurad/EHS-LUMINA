# Supabase Setup Guide for EHS ERP

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click **"New Project"**
4. Fill in the details:
   - **Project Name**: `ehs-erp`
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Select the closest region to your users
5. Click **"Create new project"** and wait 2-3 minutes

---

## Step 2: Get Your API Keys

Once your project is ready:

1. Go to **Settings** (gear icon in sidebar)
2. Click on **API** in the left menu
3. You'll see:
   - **Project URL** → Copy this
   - **anon public** key → Copy this
   - **service_role** key → Copy this (keep secret!)

---

## Step 3: Configure Environment Variables

1. In your project root, create a `.env.local` file:

```bash
# Copy from .env.example and fill in your values
cp .env.example .env.local
```

2. Edit `.env.local` with your Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="EHS ERP"
NEXT_PUBLIC_ENVIRONMENT=development
```

---

## Step 4: Run Database Migrations

1. Go to Supabase Dashboard
2. Click on **SQL Editor** (left sidebar)
3. Click **"New Query"**
4. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
5. Click **"Run"**

Then repeat for:
- `supabase/migrations/002_rls_policies.sql`
- `supabase/seeds/001_admin_user.sql`

---

## Step 5: Enable Authentication

1. Go to **Authentication** in Supabase sidebar
2. Go to **Providers** tab
3. Make sure **Email** is enabled
4. Configure settings:
   - ✅ Enable Email Confirmations (for production)
   - ❌ Disable Email Confirmations (for development - easier testing)

For development, go to **Authentication → Settings** and:
- Set **Site URL** to `http://localhost:3000`
- Add `http://localhost:3000/**` to **Redirect URLs**

---

## Step 6: Verify Setup

1. Go to **Table Editor** in Supabase
2. You should see these tables:
   - `profiles`
   - `students`
   - `teachers`
   - `classes`
   - `sections`
   - `sessions`
   - `fee_structures`
   - `student_fees`
   - `payments`
   - `promotions`
   - `activity_logs`

3. Check **Authentication → Users**:
   - You should see your Super Admin user

---

## Default Super Admin Credentials

After running the seed script:

- **Email**: `admin@ehs.edu.pk`
- **Password**: `Admin@123456`

⚠️ **IMPORTANT**: Change this password immediately after first login!

---

## Troubleshooting

### "Invalid API Key" Error
- Make sure you copied the full keys without extra spaces
- Restart your Next.js dev server after changing `.env.local`

### Tables not showing
- Make sure you ran the migration SQL scripts in order
- Check the SQL Editor for any error messages

### Can't log in
- Verify email confirmation settings
- Check if the user exists in Authentication → Users
- Check if the profile exists in Table Editor → profiles

---

## Next Steps

After completing this setup:
1. ✅ Start the dev server: `npm run dev`
2. ✅ Go to `http://localhost:3000/login`
3. ✅ Log in with admin credentials
4. ✅ You're ready to use the dashboard!

