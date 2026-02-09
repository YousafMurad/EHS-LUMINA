// Class Actions - Server actions for class CRUD
"use server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth/helpers";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { revalidatePath } from "next/cache";
export interface CreateClassData {
  name: string;
  grade_level: number;
  description?: string;
  is_active?: boolean;
}
export async function createClass(data: CreateClassData) {
  await requireAuth();
  
  const canCreate = await hasPermission(PERMISSIONS.CLASSES_CREATE);
  if (!canCreate) {
    return { error: "You don't have permission to create classes" };
  }
  const supabase = await createServerSupabaseClient();
  const { data: classData, error } = await supabase
    .from("classes")
    .insert({
      ...data,
      is_active: data.is_active ?? true,
    } as any)
    .select()
    .single();
  if (error) {
    return { error: error.message };
  }
  revalidatePath("/classes");
  return { success: true, data: classData };
}
export async function updateClass(id: string, data: Partial<CreateClassData>) {
  await requireAuth();
  
  const canEdit = await hasPermission(PERMISSIONS.CLASSES_EDIT);
  if (!canEdit) {
    return { error: "You don't have permission to edit classes" };
  }
  const supabase = await createServerSupabaseClient();
  const { data: classData, error } = await supabase
    .from("classes")
    .update(data as any)
    .eq("id", id)
    .select()
    .single();
  if (error) {
    return { error: error.message };
  }
  revalidatePath("/classes");
  revalidatePath(`/classes/${id}`);
  return { success: true, data: classData };
}
export async function deleteClass(id: string) {
  await requireAuth();
  
  const canDelete = await hasPermission(PERMISSIONS.CLASSES_DELETE);
  if (!canDelete) {
    return { error: "You don't have permission to delete classes" };
  }
  const supabase = await createServerSupabaseClient();
  // Check if class has students
  const { count } = await supabase
    .from("students")
    .select("*", { count: "exact", head: true })
    .eq("class_id", id)
    .eq("status", "active");
  if (count && count > 0) {
    return { error: "Cannot delete class with active students" };
  }
  const { error } = await supabase
    .from("classes")
    .update({ is_active: false } as any)
    .eq("id", id);
  if (error) {
    return { error: error.message };
  }
  revalidatePath("/classes");
  return { success: true };
}
