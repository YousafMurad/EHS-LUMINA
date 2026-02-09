// Student Types
import type { Database } from "./database";

export type Student = Database["public"]["Tables"]["students"]["Row"];
export type StudentInsert = Database["public"]["Tables"]["students"]["Insert"];
export type StudentUpdate = Database["public"]["Tables"]["students"]["Update"];

export type StudentStatus = "active" | "left" | "completed" | "deleted";
export type Gender = "male" | "female" | "other";
export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export interface StudentWithRelations extends Student {
  classes?: {
    id: string;
    name: string;
    grade_level?: number;
  };
  sections?: {
    id: string;
    name: string;
  };
  family_members?: FamilyMember[];
  promotions?: PromotionRecord[];
}

export interface FamilyMember {
  id: string;
  student_id: string;
  relation: string;
  name: string;
  cnic: string | null;
  phone: string | null;
  occupation: string | null;
}

export interface PromotionRecord {
  id: string;
  from_class_id: string;
  to_class_id: string;
  from_class?: { name: string };
  to_class?: { name: string };
  promoted_at: string;
  is_demotion: boolean;
}

export interface StudentFormData {
  name: string;
  father_name: string;
  mother_name?: string;
  date_of_birth: string;
  gender: Gender;
  class_id: string;
  section_id: string;
  admission_date: string;
  address?: string;
  phone?: string;
  email?: string;
  cnic?: string;
  blood_group?: BloodGroup;
  emergency_contact?: string;
}
