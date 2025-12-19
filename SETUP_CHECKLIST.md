# Setup Checklist ✅

## What I've Already Done For You

✅ Created complete Next.js 14 app with TypeScript  
✅ Built all authentication pages (login, signup)  
✅ Created student, teacher, and professor dashboards  
✅ Set up Supabase client configuration  
✅ Written database migration SQL file  
✅ Fixed all build errors  
✅ Pushed code to GitHub  

## What You Need To Do (2 Steps - 5 minutes)

### ⚠️ CRITICAL: Step 1 - Fix API Keys

**Problem**: Your `.env.local` file has incomplete/truncated API keys

**Solution**:
1. Go to: https://app.supabase.com/project/rwcyogbyxmwulmivgcgh
2. Click **Settings** (gear icon) → **API**
3. Copy the **COMPLETE** `anon public` key (it's ~200+ characters!)
4. Update your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://rwcyogbyxmwulmivgcgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ... (PASTE FULL KEY HERE)
```

**How to know you got the right key**:
- It starts with `eyJhbG...`
- It's VERY LONG (200+ characters)
- It has dots (.) separating three parts

---

### ⚠️ CRITICAL: Step 2 - Create Database Tables

**Problem**: Database tables don't exist yet (that's why you'll get errors)

**Solution**:
1. Go to: https://app.supabase.com/project/rwcyogbyxmwulmivgcgh
2. Click **SQL Editor** in sidebar
3. Click **+ New query**
4. Open file: `supabase/migrations/001_initial_schema.sql` in VS Code
5. Copy **ALL** the SQL code (Ctrl+A, Ctrl+C)
6. Paste into Supabase SQL editor
7. Click **RUN** (bottom right)
8. Wait for: "Success. No rows returned" ✅

**This creates**:
- 5 database tables (profiles, courses, enrollments, grades, events)
- Row-Level Security policies (so students can only see their own data)
- Trigger to auto-create user profiles when someone signs up

---

## Testing After Setup

```bash
# 1. Start the dev server
npm run dev

# 2. Open browser
http://localhost:3000

# 3. Click "Sign Up"
Full Name: John Student
Email: student@test.com
Password: test123
Role: Student

# 4. You should be logged in automatically and see the student dashboard!
```

---

## Verification Checklist

Before creating your first user, verify:

- [ ] `.env.local` has the COMPLETE anon key (200+ characters)
- [ ] Supabase SQL migration was run successfully
- [ ] Dev server is running (`npm run dev`)
- [ ] No errors in terminal

---

## Quick Visual Guide

```
┌─────────────────────────────────────────────────┐
│ 1. Supabase Dashboard                           │
│    https://app.supabase.com                     │
│                                                 │
│    Settings → API                               │
│    ├── Copy: Project URL                        │
│    └── Copy: anon public key (FULL KEY!)       │
│                                                 │
│    Update .env.local with these ↑              │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ 2. Supabase SQL Editor                          │
│                                                 │
│    SQL Editor → New Query                       │
│    ├── Copy code from:                          │
│    │   supabase/migrations/001_initial_schema.sql
│    ├── Paste into SQL editor                    │
│    └── Click RUN                                │
│                                                 │
│    Creates all database tables ↑                │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ 3. Test Your App                                │
│                                                 │
│    npm run dev                                  │
│    Open: http://localhost:3000                  │
│    Sign Up → Create account → Login! ✅         │
└─────────────────────────────────────────────────┘
```

---

## Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "Invalid API key" | Truncated key in `.env.local` | Get FULL key from Supabase Settings → API |
| "relation 'profiles' does not exist" | Haven't run SQL migration | Run the SQL in Supabase SQL Editor |
| Can't sign up | Keys not set or DB not created | Complete both Step 1 and Step 2 above |
| Build errors | TypeScript errors | Already fixed! Pull latest code from GitHub |

---

## Your App Features (Ready to Use!)

### For Students:
- Dashboard with enrollment stats
- View enrolled classes
- Check grades by course
- See teacher contacts
- Personal calendar
- Profile management

### For Teachers:
- Dashboard with teaching stats  
- Manage courses
- View student roster
- Enter grades for assignments
- Calendar and profile

### For Professors (Admin):
- System-wide overview
- View all classes and teachers
- Access all student grades
- Analytics dashboard with charts
- Full system access

---

## Next Steps After Setup

1. Create multiple users with different roles
2. Add sample courses in Supabase dashboard
3. Create enrollments (link students to courses)
4. Test grade entry as a teacher
5. View analytics as a professor
6. Deploy to Vercel!

---

**Need Help?** Check the main README.md for detailed documentation.

**GitHub**: https://github.com/bmwenyemali/classroom
