// Class and Section Types
import type { Database } from "./database";

export type Class = Database["public"]["Tables"]["classes"]["Row"];
export type ClassInsert = Database["public"]["Tables"]["classes"]["Insert"];
export type ClassUpdate = Database["public"]["Tables"]["classes"]["Update"];

export type Section = Database["public"]["Tables"]["sections"]["Row"];
export type SectionInsert = Database["public"]["Tables"]["sections"]["Insert"];
export type SectionUpdate = Database["public"]["Tables"]["sections"]["Update"];

export interface ClassWithRelations extends Class {
  sections?: SectionWithRelations[];
  students?: { id: string }[];
  student_count?: number;
  section_count?: number;
  fee_structures?: {
    id: string;
    monthly_fee: number;
  }[];
}

export interface SectionWithRelations extends Section {
  classes?: {
    id: string;
    name: string;
    grade_level: number;
  };
  teachers?: {
    id: string;
    name: string;
    phone?: string;
  };
  students?: {
    id: string;
    name: string;
    registration_no: string;
  }[];
  student_count?: number;
}

export interface ClassFormData {
  name: string;
  grade_level: number;
  description?: string;
  is_active?: boolean;
}

export interface SectionFormData {
  name: string;
  class_id: string;
  capacity?: number;
  teacher_id?: string;
  is_active?: boolean;
}

export interface ClassOption {
  value: string;
  label: string;
}

export interface SectionOption {
  value: string;
  label: string;
}
