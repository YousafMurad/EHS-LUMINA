// Teacher Types
import type { Database } from "./database";

export type Teacher = Database["public"]["Tables"]["teachers"]["Row"];
export type TeacherInsert = Database["public"]["Tables"]["teachers"]["Insert"];
export type TeacherUpdate = Database["public"]["Tables"]["teachers"]["Update"];
export type SalaryHistory = Database["public"]["Tables"]["salary_history"]["Row"];

export type ContractType = "permanent" | "contract" | "visiting";

export interface TeacherWithRelations extends Teacher {
  sections?: {
    id: string;
    name: string;
    classes?: { id: string; name: string };
  }[];
  salary_history?: SalaryHistory[];
}

export interface TeacherFormData {
  name: string;
  email?: string;
  phone: string;
  cnic: string;
  address?: string;
  qualification?: string;
  specialization?: string;
  joining_date: string;
  salary: number;
  contract_type: ContractType;
  agreement_terms?: string;
}

export interface TeacherOption {
  value: string;
  label: string;
}

export interface TeacherStats {
  total: number;
  byContractType: Record<string, number>;
}
