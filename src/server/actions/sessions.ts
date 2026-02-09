// Session Actions - Server actions for session/academic year management
"use server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
export interface CreateSessionData {
  name: string;
  start_date: string;
  end_date: string;
  is_active?: boolean;
}
export async function createSession(data: CreateSessionData) {
  const supabase = await createServerSupabaseClient();
  // If setting as active, deactivate others first
  if (data.is_active) {
    await supabase
      .from("sessions")
      .update({ is_active: false } as any)
      .eq("is_active", true);
  }
  const { data: session, error } = await supabase
    .from("sessions")
    .insert({
      ...data,
      is_active: data.is_active ?? false,
    } as any)
    .select()
    .single();
  if (error) {
    return { error: error.message };
  }
  revalidatePath("/sessions");
  return { success: true, data: session };
}
export async function updateSession(id: string, data: Partial<CreateSessionData>) {
  const supabase = await createServerSupabaseClient();
  // If setting as active, deactivate others first
  if (data.is_active) {
    await supabase
      .from("sessions")
      .update({ is_active: false } as any)
      .neq("id", id);
  }
  const { data: session, error } = await supabase
    .from("sessions")
    .update(data as any)
    .eq("id", id)
    .select()
    .single();
  if (error) {
    return { error: error.message };
  }
  revalidatePath("/sessions");
  revalidatePath(`/sessions/${id}`);
  return { success: true, data: session };
}
export async function deleteSession(id: string) {
  const supabase = await createServerSupabaseClient();
  // Check if session has students
  const { count } = await supabase
    .from("students")
    .select("*", { count: "exact", head: true })
    .eq("session_id", id);
  if (count && count > 0) {
    return { error: "Cannot delete session with enrolled students" };
  }
  const { error } = await supabase
    .from("sessions")
    .delete()
    .eq("id", id);
  if (error) {
    return { error: error.message };
  }
  revalidatePath("/sessions");
  return { success: true };
}
export async function setActiveSession(id: string) {
  const supabase = await createServerSupabaseClient();
  // Deactivate all sessions
  await supabase
    .from("sessions")
    .update({ is_active: false } as any)
    .neq("id", "");
  // Activate the selected session
  const { error } = await supabase
    .from("sessions")
    .update({ is_active: true } as any)
    .eq("id", id);
  if (error) {
    return { error: error.message };
  }
  revalidatePath("/sessions");
  revalidatePath("/dashboard");
  return { success: true };
}
