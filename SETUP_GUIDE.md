# Quick Setup Guide

## Ì∫Ä Getting Started (5 minutes)

### Step 1: Run the Database Migration

**IMPORTANT**: Before you can use the app, you must create the database tables in Supabase.

1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your project: `rwcyogbyxmwulmivgcgh`
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Open the file `supabase/migrations/001_initial_schema.sql` in this project
6. Copy ALL the contents (entire file)
7. Paste into the Supabase SQL editor
8. Click **RUN** button

You should see "Success. No rows returned" - this is normal and correct!

### Step 2: Start the App

```bash
npm run dev
```

### Step 3: Create Your First Account

1. Open http://localhost:3000
2. Click **Sign Up**
3. Create an account with any role (Student, Teacher, or Professor)
4. You'll be logged in automatically!

## ‚úÖ What Was Created

### Authentication Pages
- `/login` - Sign in page
- `/signup` - Registration with role selection

### Student Pages
- `/dashboard/student` - Overview with stats
- `/dashboard/classes` - Enrolled courses
- `/dashboard/grades` - Grades by course
- `/dashboard/teachers` - Teacher contacts
- `/dashboard/calendar` - Events
- `/dashboard/profile` - Profile management

### Teacher Pages
- `/dashboard/teacher` - Teaching overview
- `/dashboard/courses` - Manage courses
- `/dashboard/students` - Student roster
- `/dashboard/grade-entry` - Add grades

### Professor Pages (Admin)
- `/dashboard/professor` - System overview
- `/dashboard/all-classes` - All courses
- `/dashboard/all-grades` - All grades
- `/dashboard/analytics` - Performance metrics

## Ì¥ß Database Tables Created

- **profiles** - User accounts with roles
- **courses** - Course catalog
- **enrollments** - Student-course links
- **grades** - Assignment scores
- **events** - Calendar events

All tables have Row-Level Security (RLS) configured!

## Ìæ® Features

‚úÖ Role-based authentication (Student, Teacher, Professor)
‚úÖ Responsive dashboard layouts
‚úÖ Real-time data from Supabase
‚úÖ Secure with RLS policies
‚úÖ Modern UI with Tailwind CSS
‚úÖ Type-safe with TypeScript

## Ì≥ù Testing the App

### As a Student:
1. Sign up as a Student
2. View your empty dashboard (no data yet)
3. Go to Profile and update your information

### As a Teacher:
1. Sign up as a Teacher
2. View courses (empty initially)
3. Try the grade entry form

### As a Professor:
1. Sign up as Tenured Professor
2. View All Classes and All Grades
3. Check Analytics dashboard

## Ì¥ê Environment Variables

Already configured in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://rwcyogbyxmwulmivgcgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## ÔøΩÔøΩ Troubleshooting

**Problem**: "relation 'profiles' does not exist"
**Solution**: You haven't run the database migration. Follow Step 1 above.

**Problem**: Can't sign up
**Solution**: Check that your `.env.local` file exists and has the correct Supabase credentials.

**Problem**: Dashboard shows errors
**Solution**: Make sure the database migration was successful.

## Ì≥ö Next Steps

1. Add sample data (courses, enrollments) manually in Supabase
2. Test the grade entry feature
3. Explore the analytics dashboard
4. Customize the styling
5. Deploy to Vercel

## Ìºê Deployment

Push to GitHub and deploy on Vercel:
1. Connect your GitHub repo to Vercel
2. Add the environment variables
3. Deploy!

Your live app will be at: `https://your-app.vercel.app`

---

**Repository**: https://github.com/bmwenyemali/classroom
**Supabase Project**: https://app.supabase.com/project/rwcyogbyxmwulmivgcgh
