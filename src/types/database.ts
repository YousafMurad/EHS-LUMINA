// Database Types - Generated from Supabase schema
// This file should be regenerated using: npx supabase gen types typescript

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          role: string
          phone: string | null
          avatar_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id: string
          email: string
          name: string
          role?: string
          phone?: string | null
          avatar_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: string
          phone?: string | null
          avatar_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      students: {
        Row: {
          id: string
          registration_no: string
          name: string
          father_name: string
          mother_name: string | null
          father_cnic: string | null
          mother_cnic: string | null
          date_of_birth: string
          gender: string
          class_id: string
          section_id: string
          admission_date: string
          address: string | null
          phone: string | null
          email: string | null
          cnic: string | null
          blood_group: string | null
          emergency_contact: string | null
          photo_url: string | null
          status: string
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          registration_no: string
          name: string
          father_name: string
          mother_name?: string | null
          father_cnic?: string | null
          mother_cnic?: string | null
          date_of_birth: string
          gender: string
          class_id: string
          section_id: string
          admission_date: string
          address?: string | null
          phone?: string | null
          email?: string | null
          cnic?: string | null
          blood_group?: string | null
          emergency_contact?: string | null
          photo_url?: string | null
          status?: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          registration_no?: string
          name?: string
          father_name?: string
          mother_name?: string | null
          father_cnic?: string | null
          mother_cnic?: string | null
          date_of_birth?: string
          gender?: string
          class_id?: string
          section_id?: string
          admission_date?: string
          address?: string | null
          phone?: string | null
          email?: string | null
          cnic?: string | null
          blood_group?: string | null
          emergency_contact?: string | null
          photo_url?: string | null
          status?: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      attendance: {
        Row: {
          id: string
          student_id: string
          section_id: string
          date: string
          status: "present" | "absent" | "late" | "excused" | "half_day"
          marked_by: string | null
          remarks: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          section_id: string
          date: string
          status: "present" | "absent" | "late" | "excused" | "half_day"
          marked_by?: string | null
          remarks?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          section_id?: string
          date?: string
          status?: "present" | "absent" | "late" | "excused" | "half_day"
          marked_by?: string | null
          remarks?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      classes: {
        Row: {
          id: string
          name: string
          grade_level: number
          description: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          grade_level: number
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          grade_level?: number
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      sections: {
        Row: {
          id: string
          name: string
          class_id: string
          capacity: number | null
          teacher_id: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          class_id: string
          capacity?: number | null
          teacher_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          class_id?: string
          capacity?: number | null
          teacher_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      teachers: {
        Row: {
          id: string
          employee_code: string
          name: string
          email: string | null
          phone: string
          cnic: string
          address: string | null
          qualification: string | null
          specialization: string | null
          joining_date: string
          left_date: string | null
          salary: number
          contract_type: string
          agreement_terms: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employee_code: string
          name: string
          email?: string | null
          phone: string
          cnic: string
          address?: string | null
          qualification?: string | null
          specialization?: string | null
          joining_date: string
          left_date?: string | null
          salary: number
          contract_type?: string
          agreement_terms?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employee_code?: string
          name?: string
          email?: string | null
          phone?: string
          cnic?: string
          address?: string | null
          qualification?: string | null
          specialization?: string | null
          joining_date?: string
          left_date?: string | null
          salary?: number
          contract_type?: string
          agreement_terms?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      sessions: {
        Row: {
          id: string
          name: string
          start_date: string
          end_date: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          start_date: string
          end_date: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          start_date?: string
          end_date?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      fee_structures: {
        Row: {
          id: string
          name: string
          class_id: string
          session_id: string
          monthly_fee: number
          admission_fee: number
          security_fee: number
          registration_fee: number
          miscellaneous_fee: number | null
          board_registration_fee: number | null
          board_admission_fee: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          class_id: string
          session_id: string
          monthly_fee: number
          admission_fee: number
          security_fee: number
          registration_fee: number
          miscellaneous_fee?: number | null
          board_registration_fee?: number | null
          board_admission_fee?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          class_id?: string
          session_id?: string
          monthly_fee?: number
          admission_fee?: number
          security_fee?: number
          registration_fee?: number
          miscellaneous_fee?: number | null
          board_registration_fee?: number | null
          board_admission_fee?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      student_fees: {
        Row: {
          id: string
          student_id: string
          fee_month: number
          fee_year: number
          amount: number
          paid_amount: number | null
          status: string
          due_date: string
          paid_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          fee_month: number
          fee_year: number
          amount: number
          paid_amount?: number | null
          status?: string
          due_date: string
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          fee_month?: number
          fee_year?: number
          amount?: number
          paid_amount?: number | null
          status?: string
          due_date?: string
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          student_id: string
          receipt_no: string
          amount: number
          payment_method: string
          fee_month: string
          fee_year: number
          remarks: string | null
          payment_date: string
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          receipt_no: string
          amount: number
          payment_method: string
          fee_month: string
          fee_year: number
          remarks?: string | null
          payment_date: string
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          receipt_no?: string
          amount?: number
          payment_method?: string
          fee_month?: string
          fee_year?: number
          remarks?: string | null
          payment_date?: string
          created_at?: string
        }
      }
      promotions: {
        Row: {
          id: string
          student_id: string
          from_class_id: string
          from_section_id: string
          to_class_id: string
          to_section_id: string
          session_id: string
          is_demotion: boolean
          remarks: string | null
          promoted_at: string
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          from_class_id: string
          from_section_id: string
          to_class_id: string
          to_section_id: string
          session_id: string
          is_demotion?: boolean
          remarks?: string | null
          promoted_at: string
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          from_class_id?: string
          from_section_id?: string
          to_class_id?: string
          to_section_id?: string
          session_id?: string
          is_demotion?: boolean
          remarks?: string | null
          promoted_at?: string
          created_at?: string
        }
      }
      role_permissions: {
        Row: {
          id: string
          role: string
          permission: string
          created_at: string
        }
        Insert: {
          id?: string
          role: string
          permission: string
          created_at?: string
        }
        Update: {
          id?: string
          role?: string
          permission?: string
          created_at?: string
        }
      }
      user_permissions: {
        Row: {
          id: string
          user_id: string
          permission: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          permission: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          permission?: string
          created_at?: string
        }
      }
      student_discounts: {
        Row: {
          id: string
          student_id: string
          discount_type: string
          discount_value: number
          is_percentage: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          discount_type: string
          discount_value: number
          is_percentage?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          discount_type?: string
          discount_value?: number
          is_percentage?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      family_members: {
        Row: {
          id: string
          student_id: string
          relation: string
          name: string
          cnic: string | null
          phone: string | null
          occupation: string | null
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          relation: string
          name: string
          cnic?: string | null
          phone?: string | null
          occupation?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          relation?: string
          name?: string
          cnic?: string | null
          phone?: string | null
          occupation?: string | null
          created_at?: string
        }
      }
      salary_history: {
        Row: {
          id: string
          teacher_id: string
          old_salary: number
          new_salary: number
          effective_date: string
          created_at: string
        }
        Insert: {
          id?: string
          teacher_id: string
          old_salary: number
          new_salary: number
          effective_date: string
          created_at?: string
        }
        Update: {
          id?: string
          teacher_id?: string
          old_salary?: number
          new_salary?: number
          effective_date?: string
          created_at?: string
        }
      }
      system_settings: {
        Row: {
          id: string
          key: string
          value: Json
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string
          action: string
          table_name: string
          record_id: string
          old_data: Json | null
          new_data: Json | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          table_name: string
          record_id: string
          old_data?: Json | null
          new_data?: Json | null
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          table_name?: string
          record_id?: string
          old_data?: Json | null
          new_data?: Json | null
          ip_address?: string | null
          created_at?: string
        }
      }
      subjects: {
        Row: {
          id: string
          name: string
          code: string
          description: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      teacher_class_assignments: {
        Row: {
          id: string
          teacher_id: string
          class_id: string
          section_id: string | null
          subject_id: string | null
          is_class_teacher: boolean
          can_mark_attendance: boolean
          is_active: boolean
          assigned_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          teacher_id: string
          class_id: string
          section_id?: string | null
          subject_id?: string | null
          is_class_teacher?: boolean
          can_mark_attendance?: boolean
          is_active?: boolean
          assigned_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          teacher_id?: string
          class_id?: string
          section_id?: string | null
          subject_id?: string | null
          is_class_teacher?: boolean
          can_mark_attendance?: boolean
          is_active?: boolean
          assigned_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      parent_students: {
        Row: {
          id: string
          parent_id: string
          student_id: string
          relationship: "father" | "mother" | "guardian" | "parent"
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          parent_id: string
          student_id: string
          relationship?: "father" | "mother" | "guardian" | "parent"
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          parent_id?: string
          student_id?: string
          relationship?: "father" | "mother" | "guardian" | "parent"
          is_primary?: boolean
          created_at?: string
        }
      }
      exam_types: {
        Row: {
          id: string
          name: string
          code: string
          description: string | null
          weightage: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          description?: string | null
          weightage?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          description?: string | null
          weightage?: number
          is_active?: boolean
          created_at?: string
        }
      }
      result_deadlines: {
        Row: {
          id: string
          session_id: string
          exam_type_id: string
          class_id: string | null
          subject_id: string | null
          start_date: string
          end_date: string
          is_open: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          session_id: string
          exam_type_id: string
          class_id?: string | null
          subject_id?: string | null
          start_date: string
          end_date: string
          is_open?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          exam_type_id?: string
          class_id?: string | null
          subject_id?: string | null
          start_date?: string
          end_date?: string
          is_open?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      student_results: {
        Row: {
          id: string
          student_id: string
          session_id: string
          exam_type_id: string
          subject_id: string
          class_id: string
          section_id: string
          total_marks: number
          obtained_marks: number
          grade: string | null
          remarks: string | null
          is_absent: boolean
          submitted_by: string | null
          approved_by: string | null
          approved_at: string | null
          is_locked: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          session_id: string
          exam_type_id: string
          subject_id: string
          class_id: string
          section_id: string
          total_marks: number
          obtained_marks: number
          grade?: string | null
          remarks?: string | null
          is_absent?: boolean
          submitted_by?: string | null
          approved_by?: string | null
          approved_at?: string | null
          is_locked?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          session_id?: string
          exam_type_id?: string
          subject_id?: string
          class_id?: string
          section_id?: string
          total_marks?: number
          obtained_marks?: number
          grade?: string | null
          remarks?: string | null
          is_absent?: boolean
          submitted_by?: string | null
          approved_by?: string | null
          approved_at?: string | null
          is_locked?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      suggestions_complaints: {
        Row: {
          id: string
          parent_id: string
          student_id: string | null
          type: "suggestion" | "complaint" | "feedback" | "inquiry"
          subject: string
          message: string
          priority: "low" | "normal" | "high" | "urgent"
          status: "pending" | "in_progress" | "resolved" | "closed"
          response: string | null
          responded_by: string | null
          responded_at: string | null
          is_anonymous: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          parent_id: string
          student_id?: string | null
          type: "suggestion" | "complaint" | "feedback" | "inquiry"
          subject: string
          message: string
          priority?: "low" | "normal" | "high" | "urgent"
          status?: "pending" | "in_progress" | "resolved" | "closed"
          response?: string | null
          responded_by?: string | null
          responded_at?: string | null
          is_anonymous?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          parent_id?: string
          student_id?: string | null
          type?: "suggestion" | "complaint" | "feedback" | "inquiry"
          subject?: string
          message?: string
          priority?: "low" | "normal" | "high" | "urgent"
          status?: "pending" | "in_progress" | "resolved" | "closed"
          response?: string | null
          responded_by?: string | null
          responded_at?: string | null
          is_anonymous?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      class_subjects: {
        Row: {
          id: string
          class_id: string
          subject_id: string
          is_mandatory: boolean
          created_at: string
        }
        Insert: {
          id?: string
          class_id: string
          subject_id: string
          is_mandatory?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          class_id?: string
          subject_id?: string
          is_mandatory?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
