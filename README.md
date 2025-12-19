# Classroom Management System

A comprehensive classroom management web application built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## Features

### Three User Roles

1. **Student**
   - View enrolled classes
   - Check grades by course
   - View teacher contact information
   - Manage personal calendar
   - Update profile

2. **Teacher**
   - Manage courses
   - View enrolled students
   - Enter and manage grades
   - View course analytics

3. **Tenured Professor** (Admin)
   - View all classes in the system
   - Access all student grades
   - View system-wide analytics
   - Monitor performance metrics

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database & Auth**: Supabase (PostgreSQL + Auth)
- **Icons**: Heroicons

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/bmwenyemali/classroom.git
cd classroom
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to **Settings** → **API** and copy:
   - Project URL
   - `anon` public key

3. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Run Database Migration

1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the contents of `supabase/migrations/001_initial_schema.sql`
5. Paste into the SQL editor
6. Click **Run** to execute the migration

This will create:
- `profiles` table (user profiles with roles)
- `courses` table (course information)
- `enrollments` table (student-course relationships)
- `grades` table (assignment grades)
- `events` table (calendar events)
- Row Level Security (RLS) policies for all tables
- Database indexes for performance
- Trigger to auto-create profiles on user signup

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Creating Your First User

1. Click **Sign Up** on the landing page
2. Fill in:
   - Full Name
   - Email
   - Password (min 6 characters)
   - Role (Student, Teacher, or Tenured Professor)
3. Click **Sign Up**

You'll be automatically logged in and redirected to your role-specific dashboard.

### Student Dashboard

- **Dashboard**: Overview with stats (enrolled classes, average grade, etc.)
- **My Classes**: View all enrolled courses
- **My Grades**: See grades organized by course
- **Teachers**: Contact information for instructors
- **Calendar**: Upcoming events and deadlines
- **Profile**: Update personal information

### Teacher Dashboard

- **Dashboard**: Overview of courses and students
- **My Courses**: Manage teaching assignments
- **Students**: View enrolled students across all courses
- **Grade Entry**: Add grades for students
- **Calendar**: Manage events
- **Profile**: Update personal information

### Professor Dashboard

- **Dashboard**: System-wide overview
- **All Classes**: View all courses in the system
- **All Grades**: Comprehensive grade reports
- **Analytics**: Performance metrics and grade distribution
- **Calendar**: System events
- **Profile**: Update personal information

## Database Schema

### Tables

- **profiles**: User information and roles
- **courses**: Course details and teacher assignments
- **enrollments**: Student-course relationships
- **grades**: Assignment scores
- **events**: Calendar events

### Security

All tables have Row Level Security (RLS) enabled:
- Students can only view their own data
- Teachers can view/manage data for their courses
- Professors have full system access

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy

## Project Structure

```
classroom/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── dashboard/           # Dashboard pages
│   │   ├── student/         # Student-specific pages
│   │   ├── teacher/         # Teacher-specific pages
│   │   ├── professor/       # Professor-specific pages
│   │   ├── classes/
│   │   ├── grades/
│   │   ├── courses/
│   │   └── ...
│   └── page.tsx             # Landing page
├── components/              # Reusable components
│   ├── DashboardNav.tsx
│   ├── ProfileForm.tsx
│   └── GradeEntryForm.tsx
├── lib/
│   ├── supabase/           # Supabase clients
│   └── types.ts            # TypeScript types
└── supabase/
    └── migrations/         # Database migrations
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
