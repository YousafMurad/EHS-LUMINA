// Auth Actions - Server actions for authentication
"use server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  if (!email || !password) {
    return { error: "Email and password are required" };
  }
  const supabase = await createServerSupabaseClient();
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    return { error: error.message };
  }
  revalidatePath("/", "layout");
  redirect("/dashboard");
}
export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const role = formData.get("role") as string || "operator";
  if (!email || !password || !name) {
    return { error: "All fields are required" };
  }
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role,
      },
    },
  });
  if (error) {
    return { error: error.message };
  }
  // Create profile
  if (data.user) {
    await supabase.from("profiles").insert({
      id: data.user.id,
      email,
      name,
      role,
    } as any);
  }
  return { success: true };
}
export async function signOut() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
export async function resetPassword(formData: FormData) {
  const email = formData.get("email") as string;
  if (!email) {
    return { error: "Email is required" };
  }
  const supabase = await createServerSupabaseClient();
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/reset-password`,
  });
  if (error) {
    return { error: error.message };
  }
  return { success: true, message: "Password reset email sent" };
}
export async function updatePassword(formData: FormData) {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  if (!password || !confirmPassword) {
    return { error: "Both password fields are required" };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }
  const supabase = await createServerSupabaseClient();
  
  const { error } = await supabase.auth.updateUser({
    password,
  });
  if (error) {
    return { error: error.message };
  }
  return { success: true, message: "Password updated successfully" };
}
