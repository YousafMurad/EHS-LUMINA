// Session Types
import type { Database } from "./database";

export type Session = Database["public"]["Tables"]["sessions"]["Row"];
export type SessionInsert = Database["public"]["Tables"]["sessions"]["Insert"];
export type SessionUpdate = Database["public"]["Tables"]["sessions"]["Update"];

export interface SessionFormData {
  name: string;
  start_date: string;
  end_date: string;
  is_active?: boolean;
}

export interface SessionOption {
  value: string;
  label: string;
}

export interface AcademicYear {
  year: number;
  label: string; // e.g., "2025-2026"
}
