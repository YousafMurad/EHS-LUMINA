// User and Auth Types
import type { Database } from "./database";
import type { User } from "@supabase/supabase-js";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type Role = "super_admin" | "admin" | "accountant" | "teacher" | "operator" | "student";

export interface UserWithProfile {
  user: User;
  profile: Profile | null;
}

export interface Operator extends Profile {
  user_permissions?: { permission: string }[];
}

export interface OperatorFormData {
  email: string;
  password: string;
  name: string;
  role: Role;
  phone?: string;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar_url?: string;
  permissions: string[];
}

export interface AuthState {
  user: SessionUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
