// Section Actions - Server actions for section CRUD
"use server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth/helpers";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { revalidatePath } from "next/cache";
export interface CreateSectionData {
  name: string;
  class_id: string;
  capacity?: number;
  teacher_id?: string;
  is_active?: boolean;
}
export async function createSection(data: CreateSectionData) {
  await requireAuth();
  
  const canCreate = await hasPermission(PERMISSIONS.SECTIONS_CREATE);
  if (!canCreate) {
    return { error: "You don't have permission to create sections" };
  }
  const supabase = await createServerSupabaseClient();
  const { data: section, error } = await supabase
    .from("sections")
    .insert({
      ...data,
      is_active: data.is_active ?? true,
    } as any)
    .select()
    .single();
  if (error) {
    return { error: error.message };
  }
  revalidatePath("/sections");
  revalidatePath(`/classes/${data.class_id}`);
  return { success: true, data: section };
}
export async function updateSection(id: string, data: Partial<CreateSectionData>) {
  await requireAuth();
  
  const canEdit = await hasPermission(PERMISSIONS.SECTIONS_EDIT);
  if (!canEdit) {
    return { error: "You don't have permission to edit sections" };
  }
  const supabase = await createServerSupabaseClient();
  const { data: section, error } = await supabase
    .from("sections")
    .update(data as any)
    .eq("id", id)
    .select()
    .single();
  if (error) {
    return { error: error.message };
  }
  revalidatePath("/sections");
  revalidatePath(`/sections/${id}`);
  return { success: true, data: section };
}
export async function deleteSection(id: string) {
  await requireAuth();
  
  const canDelete = await hasPermission(PERMISSIONS.SECTIONS_DELETE);
  if (!canDelete) {
    return { error: "You don't have permission to delete sections" };
  }
  const supabase = await createServerSupabaseClient();
  // Check if section has students
  const { count } = await supabase
    .from("students")
    .select("*", { count: "exact", head: true })
    .eq("section_id", id)
    .eq("status", "active");
  if (count && count > 0) {
    return { error: "Cannot delete section with active students" };
  }
  const { error } = await supabase
    .from("sections")
    .update({ is_active: false } as any)
    .eq("id", id);
  if (error) {
    return { error: error.message };
  }
  revalidatePath("/sections");
  return { success: true };
}
