// 手動で書いた簡易版の型定義。
// 実際のSupabaseプロジェクト作成後は、以下のコマンドで自動生成した型に置き換えること:
//   npx supabase gen types typescript --project-id <PROJECT_ID> > src/lib/supabase/types.ts

export type UserRole = "student" | "teacher" | "admin";
export type LessonStatus = "scheduled" | "live" | "ended";
export type SubmissionStatus =
  | "not_submitted"
  | "submitted"
  | "returned"
  | "resubmit_requested";

export interface Profile {
  id: string;
  role: UserRole;
  display_name: string;
  avatar_url: string | null;
  grade: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClassRow {
  id: string;
  name: string;
  subject: string;
  teacher_id: string;
  description: string | null;
  created_at: string;
}

export interface Lesson {
  id: string;
  class_id: string;
  title: string;
  status: LessonStatus;
  scheduled_start: string;
  scheduled_end: string | null;
  started_at: string | null;
  ended_at: string | null;
  created_at: string;
}

export interface LessonMember {
  id: string;
  lesson_id: string;
  student_id: string;
  joined_at: string | null;
  last_seen_at: string | null;
}

export interface Material {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  file_path: string;
  file_type: string | null;
  created_at: string;
}

export interface LessonMaterial {
  id: string;
  lesson_id: string;
  material_id: string;
  delivered_at: string;
  delivered_by: string;
  material?: Material;
}

export interface Assignment {
  id: string;
  lesson_id: string | null;
  class_id: string;
  teacher_id: string;
  title: string;
  description: string | null;
  subject: string | null;
  due_at: string | null;
  submission_format: string;
  allow_resubmit: boolean;
  created_at: string;
}

export interface AssignmentSubmission {
  id: string;
  assignment_id: string;
  student_id: string;
  status: SubmissionStatus;
  answer_text: string | null;
  answer_file_path: string | null;
  submitted_at: string | null;
  returned_at: string | null;
  teacher_comment: string | null;
  created_at: string;
  updated_at: string;
  student?: Profile;
  assignment?: Assignment;
}

export interface ReservationSlot {
  id: string;
  created_by: string;
  category: string;
  title: string;
  starts_at: string;
  ends_at: string;
  capacity: number;
  created_at: string;
}

export interface Reservation {
  id: string;
  slot_id: string;
  student_id: string;
  status: string;
  created_at: string;
}

// supabase-js のジェネリクスを最低限満たすためのプレースホルダー。
// 型安全なクエリビルダを使う場合は本来の Database 型に差し替える。
export type Database = any;
