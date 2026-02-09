// Fee Types
import type { Database } from "./database";

export type FeeStructure = Database["public"]["Tables"]["fee_structures"]["Row"];
export type FeeStructureInsert = Database["public"]["Tables"]["fee_structures"]["Insert"];
export type StudentFee = Database["public"]["Tables"]["student_fees"]["Row"];
export type Payment = Database["public"]["Tables"]["payments"]["Row"];
export type StudentDiscount = Database["public"]["Tables"]["student_discounts"]["Row"];

export type FeeStatus = "pending" | "paid" | "partial" | "overdue";
export type PaymentMethod = "cash" | "bank" | "online";

export interface FeeStructureWithRelations extends FeeStructure {
  classes?: {
    id: string;
    name: string;
    grade_level: number;
  };
  sessions?: {
    id: string;
    name: string;
  };
}

export interface StudentFeeWithRelations extends StudentFee {
  students?: {
    id: string;
    name: string;
    registration_no: string;
    classes?: { name: string };
    sections?: { name: string };
  };
  payments?: Payment[];
}

export interface FeeBreakdown {
  monthly_fee: number;
  admission_fee: number;
  security_fee: number;
  registration_fee: number;
  miscellaneous_fee: number;
  board_registration_fee?: number;
  board_admission_fee?: number;
  discounts: number;
  fines: number;
  total: number;
}

export interface PaymentFormData {
  student_id: string;
  amount: number;
  payment_method: PaymentMethod;
  fee_month: string;
  fee_year: number;
  remarks?: string;
}

export interface FeeStructureFormData {
  name: string;
  class_id: string;
  session_id: string;
  monthly_fee: number;
  admission_fee: number;
  security_fee: number;
  registration_fee: number;
  miscellaneous_fee?: number;
  board_registration_fee?: number;
  board_admission_fee?: number;
}

export interface FeeSummary {
  totalCollected: number;
  totalPending: number;
  totalOverdue: number;
  collectionRate: number;
}
