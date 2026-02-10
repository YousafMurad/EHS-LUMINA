// Permission Checker - Server-side permission validation
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getCurrentUserWithProfile, type ProfileData } from "@/lib/auth/helpers";
import { ROLES, type Role } from "@/lib/auth/roles";
import type { Permission } from "./constants";

// Type for permission query result
interface PermissionRow {
  permission: string;
}

// Check if user has a specific permission
export async function hasPermission(permission: Permission): Promise<boolean> {
  const result = await getCurrentUserWithProfile();
  
  if (!result || !result.profile) {
    return false;
  }
  
  const { profile } = result;
  
  // Super Admin and Admin have all permissions
  if (profile.role === ROLES.SUPER_ADMIN || profile.role === ROLES.ADMIN) {
    return true;
  }
  
  // Check role_permissions table
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("role_permissions")
    .select("permission")
    .eq("role", profile.role)
    .eq("permission", permission)
    .single();
  
  return !!data;
}

// Check if user has any of the specified permissions
export async function hasAnyPermission(permissions: Permission[]): Promise<boolean> {
  for (const permission of permissions) {
    if (await hasPermission(permission)) {
      return true;
    }
  }
  return false;
}

// Check if user has all specified permissions
export async function hasAllPermissions(permissions: Permission[]): Promise<boolean> {
  for (const permission of permissions) {
    if (!(await hasPermission(permission))) {
      return false;
    }
  }
  return true;
}

// Get all permissions for current user
export async function getUserPermissions(): Promise<Permission[]> {
  const result = await getCurrentUserWithProfile();
  
  if (!result || !result.profile) {
    return [];
  }
  
  const { profile } = result;
  
  // Super Admin and Admin have all permissions (return empty to indicate full access)
  if (profile.role === ROLES.SUPER_ADMIN || profile.role === ROLES.ADMIN) {
    return []; // Empty means all permissions
  }
  
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("role_permissions")
    .select("permission")
    .eq("role", profile.role);
  
  const rows = (data || []) as PermissionRow[];
  return rows.map((row) => row.permission as Permission);
}
