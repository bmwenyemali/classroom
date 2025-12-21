# Classroom App Restructuring Plan

## Database Changes Needed

### 1. Run this SQL in Supabase:
```sql
-- Add semester to courses
ALTER TABLE courses ADD COLUMN IF NOT EXISTS semester TEXT;

-- Remove teacher_id from grades (redundant - use course->teacher)
ALTER TABLE grades DROP COLUMN IF EXISTS teacher_id;
```

## Role-Based Workflows

### Tenured Professor (Full Control)
- **Can create courses** and assign teachers
- **Can enroll students** in courses
- **View course details** with student list and grades
- **Filter by semester** using dropdown

### Teacher (Read & Grade Only)
- **Cannot create courses** (assigned by professor)
- **View assigned courses** only
- **See students** filtered by semester
- **Add/edit grades** for their students
- **Create calendar events** for their courses

### Student (View Only)
- **See enrolled courses**
- **See their teachers**
- **View their grades**
- **See calendar events**

## Key Changes Summary

1. **Grades Table**: Remove `teacher_id` (get teacher from `course->teacher_id`)
2. **Courses Table**: Add `semester` field back for filtering
3. **Course Creation**: Only professors can create (remove from teacher dashboard)
4. **Teacher Assignment**: Professors assign teachers when creating/editing courses
5. **Student Enrollment**: Professors enroll students (remove from teacher capabilities)

## UI Improvements Needed

1. **Add semester dropdown** to CourseForm (for professors)
2. **Add teacher selection** to CourseForm (for professors)
3. **Remove "Create Course" button** from teacher dashboard
4. **Add semester filter** to all course views
5. **Improve visual design** with:
   - Better color palette (blues, purples, greens)
   - Card shadows and hover effects
   - Smooth transitions
   - Better spacing and typography
   - Loading states with spinners
   - Empty states with illustrations

## Migration Steps

1. Run SQL migration (005_restructure_schema.sql)
2. Update existing seed data to include semester
3. Test with RLS policies
4. Verify all roles work correctly

Would you like me to continue implementing these changes one by one?
