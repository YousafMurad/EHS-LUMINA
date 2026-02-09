// Operator Actions - Server actions for operator/user management
"use server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/auth/helpers";
import { ROLES, type Role } from "@/lib/auth/roles";
import { revalidatePath } from "next/cache";
export interface CreateOperatorData {
  email: string;
  password: string;
  name: string;
  role: Role;
  phone?: string;
}
export async function createOperator(data: CreateOperatorData) {
  // Only admins can create operators
  await requireRole([ROLES.SUPER_ADMIN, ROLES.ADMIN]);
  const adminClient = createAdminClient();
  const supabase = await createServerSupabaseClient();
  // Create auth user
  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email: data.email,
    password: data.password,
    email_confirm: true,
  });
  if (authError) {
    return { error: authError.message };
  }
  // Create or update profile (avoid duplicate key errors)
  const profilePayload = {
    id: authData.user.id,
    email: data.email,
    name: data.name,
    role: data.role,
    phone: data.phone,
    is_active: true,
  } as any;

  const { error: profileError } = await supabase
    .from("profiles")
    .upsert(profilePayload, { onConflict: "id" });

  if (profileError) {
    // Rollback auth user creation if profile write fails
    await adminClient.auth.admin.deleteUser(authData.user.id);
    return { error: profileError.message };
  }
  revalidatePath("/operators");
  return { success: true };
}
export async function updateOperatorRole(userId: string, role: Role) {
  await requireRole([ROLES.SUPER_ADMIN, ROLES.ADMIN]);
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role } as any)
    .eq("id", userId);
  if (error) {
    return { error: error.message };
  }
  revalidatePath("/operators");
  return { success: true };
}
export async function toggleOperatorStatus(userId: string, isActive: boolean) {
  await requireRole([ROLES.SUPER_ADMIN, ROLES.ADMIN]);
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("profiles")
    .update({ is_active: isActive } as any)
    .eq("id", userId);
  if (error) {
    return { error: error.message };
  }
  revalidatePath("/operators");
  return { success: true };
}
export async function deleteOperator(userId: string) {
  await requireRole([ROLES.SUPER_ADMIN, ROLES.ADMIN]);
  const adminClient = createAdminClient();
  const supabase = await createServerSupabaseClient();
  // Soft delete profile
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ is_active: false, deleted_at: new Date().toISOString() } as any)
    .eq("id", userId);
  if (profileError) {
    return { error: profileError.message };
  }
  // Disable auth user
  const { error: authError } = await adminClient.auth.admin.updateUserById(userId, {
    ban_duration: "876600h", // ~100 years
  });
  if (authError) {
    return { error: authError.message };
  }
  revalidatePath("/operators");
  return { success: true };
}
export async function updateOperatorPermissions(
  userId: string,
  permissions: string[]
) {
  await requireRole([ROLES.SUPER_ADMIN, ROLES.ADMIN]);
  const supabase = await createServerSupabaseClient();
  // Get user's role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  if (!profile) {
    return { error: "User not found" };
  }
  // Delete existing permissions
  await supabase
    .from("user_permissions")
    .delete()
    .eq("user_id", userId);
  // Insert new permissions
  if (permissions.length > 0) {
    const permissionRecords = permissions.map((permission) => ({
      user_id: userId,
      permission,
    }));
    const { error } = await supabase
      .from("user_permissions")
      .insert(permissionRecords as any);
    if (error) {
      return { error: error.message };
    }
  }
  revalidatePath(`/operators/${userId}/permissions`);
  return { success: true };
}
