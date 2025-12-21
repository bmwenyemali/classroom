export type UserRole = "student" | "teacher" | "tenured_professor";

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  description: string | null;
  teacher_id: string;
  semester: string | null;
  credits: number;
  created_at: string;
  teacher?: Profile;
}

export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  created_at: string;
  course?: Course;
  student?: Profile;
}

export interface Grade {
  id: string;
  student_id: string;
  course_id: string;
  assignment_name: string;
  score: number;
  created_at: string;
  course?: Course;
  student?: Profile;
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  event_type: string | null;
  course_id: string | null;
  start_time: string;
  end_time: string | null;
  created_at: string;
  course?: Course;
}
