export interface Course {
  id: string;
  name: string;
  subject: string;
  description: string | null;
  teacherId: string;
  createdAt: string;
}