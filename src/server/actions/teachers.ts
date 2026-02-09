// Teacher Actions - Server actions for teacher CRUD
"use server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth } from "@/lib/auth/helpers";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { ROLES } from "@/lib/auth/roles";
import { revalidatePath } from "next/cache";

export interface CreateTeacherData {
  name: string;
  email?: string;
  phone: string;
  cnic: string;
  address?: string;
  qualification?: string;
  specialization?: string;
  joining_date: string;
  salary: number;
  contract_type: "permanent" | "contract" | "visiting";
  agreement_terms?: string;
}

export interface CreateTeacherWithAuthData extends CreateTeacherData {
  createLogin?: boolean;
  loginEmail?: string; // Separate email for login (can differ from contact email)
  password?: string;
}

// Generate unique employee code for teachers
async function generateEmployeeCode(supabase: ReturnType<typeof createServerSupabaseClient> extends Promise<infer T> ? T : never): Promise<string> {
  const year = new Date().getFullYear();
  const { count } = await supabase
    .from("teachers")
    .select("*", { count: "exact", head: true });
  return `EHS-T-${year.toString().slice(-2)}-${((count || 0) + 1).toString().padStart(3, "0")}`;
}

// Create teacher with optional auth credentials
export async function createTeacherWithAuth(data: CreateTeacherWithAuthData) {
  await requireAuth();
  
  const canCreate = await hasPermission(PERMISSIONS.TEACHERS_CREATE);
  if (!canCreate) {
    return { error: "You don't have permission to create teachers" };
  }

  const supabase = await createServerSupabaseClient();
  const adminClient = createAdminClient();
  const employee_code = await generateEmployeeCode(supabase);

  let userId: string | null = null;
  const loginEmail = data.loginEmail || data.email;

  // If creating login credentials
  if (data.createLogin && loginEmail && data.password) {
    // Create auth user first
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email: loginEmail,
      password: data.password,
      email_confirm: true,
    });

    if (authError) {
      return { error: `Failed to create login: ${authError.message}` };
    }

    userId = authData.user.id;

    // Create or update profile with teacher role
    const { data: existingProfile, error: existingProfileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    if (existingProfileError) {
      await adminClient.auth.admin.deleteUser(userId);
      return { error: `Failed to verify profile: ${existingProfileError.message}` };
    }

    const profilePayload = {
      id: userId,
      email: loginEmail,
      name: data.name,
      role: ROLES.TEACHER,
      phone: data.phone,
      is_active: true,
    } as Record<string, unknown>;

    const { error: profileError } = existingProfile
      ? await supabase.from("profiles").update(profilePayload).eq("id", userId)
      : await supabase.from("profiles").insert(profilePayload);

    if (profileError) {
      // Rollback: delete auth user if profile creation fails
      await adminClient.auth.admin.deleteUser(userId);
      return { error: `Failed to create profile: ${profileError.message}` };
    }
  }

  // Create teacher record
  const { data: teacher, error } = await supabase
    .from("teachers")
    .insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      cnic: data.cnic,
      address: data.address,
      qualification: data.qualification,
      specialization: data.specialization,
      joining_date: data.joining_date,
      salary: data.salary,
      contract_type: data.contract_type,
      agreement_terms: data.agreement_terms,
      employee_code,
      user_id: userId, // Link to auth user if created
      is_active: true,
    } as Record<string, unknown>)
    .select()
    .single();

  if (error) {
    // Rollback: delete auth user and profile if teacher creation fails
    if (userId) {
      await adminClient.auth.admin.deleteUser(userId);
    }
    return { error: error.message };
  }

  revalidatePath("/teachers");
  return { success: true, data: teacher };
}

// Legacy function - kept for backwards compatibility
export async function createTeacher(data: CreateTeacherData) {
  return createTeacherWithAuth(data);
}

export async function updateTeacher(id: string, data: Partial<CreateTeacherData>) {
  await requireAuth();
  
  const canEdit = await hasPermission(PERMISSIONS.TEACHERS_EDIT);
  if (!canEdit) {
    return { error: "You don't have permission to edit teachers" };
  }
  const supabase = await createServerSupabaseClient();
  const { data: teacher, error } = await supabase
    .from("teachers")
    .update(data as Record<string, unknown>)
    .eq("id", id)
    .select()
    .single();
  if (error) {
    return { error: error.message };
  }
  revalidatePath("/teachers");
  revalidatePath(`/teachers/${id}`);
  return { success: true, data: teacher };
}

export async function deleteTeacher(id: string) {
  await requireAuth();
  
  const canDelete = await hasPermission(PERMISSIONS.TEACHERS_DELETE);
  if (!canDelete) {
    return { error: "You don't have permission to delete teachers" };
  }
  const supabase = await createServerSupabaseClient();
  // Soft delete
  const { error } = await supabase
    .from("teachers")
    .update({ is_active: false, left_date: new Date().toISOString() } as Record<string, unknown>)
    .eq("id", id);
  if (error) {
    return { error: error.message };
  }
  revalidatePath("/teachers");
  return { success: true };
}

export async function updateTeacherSalary(id: string, salary: number, effectiveDate: string) {
  await requireAuth();
  
  const canEditSalary = await hasPermission(PERMISSIONS.TEACHERS_SALARY);
  if (!canEditSalary) {
    return { error: "You don't have permission to edit teacher salaries" };
  }
  const supabase = await createServerSupabaseClient();
  // Get current salary
  const { data: teacherData } = await supabase
    .from("teachers")
    .select("salary")
    .eq("id", id)
    .single();
  
  const currentTeacher = teacherData as { salary: number } | null;
  // Create salary history record
  await supabase.from("salary_history").insert({
    teacher_id: id,
    old_salary: currentTeacher?.salary || 0,
    new_salary: salary,
    effective_date: effectiveDate,
  } as Record<string, unknown>);
  // Update current salary
  const { error } = await supabase
    .from("teachers")
    .update({ salary } as Record<string, unknown>)
    .eq("id", id);
  if (error) {
    return { error: error.message };
  }
  revalidatePath(`/teachers/${id}`);
  return { success: true };
}

// Upload teacher photo
export async function uploadTeacherPhoto(teacherId: string, file: File) {
  await requireAuth();
  
  const canEdit = await hasPermission(PERMISSIONS.TEACHERS_EDIT);
  if (!canEdit) {
    return { error: "You don't have permission to edit teachers" };
  }

  const supabase = await createServerSupabaseClient();
  
  // Generate unique filename
  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `${teacherId}-${Date.now()}.${ext}`;
  const filePath = `teachers/${fileName}`;

  // Convert File to ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  // Upload to storage
  const { error: uploadError } = await supabase.storage
    .from("photos")
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    return { error: `Failed to upload photo: ${uploadError.message}` };
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from("photos")
    .getPublicUrl(filePath);

  const photoUrl = urlData.publicUrl;

  // Update teacher record with photo URL
  const { error: updateError } = await supabase
    .from("teachers")
    .update({ photo_url: photoUrl } as Record<string, unknown>)
    .eq("id", teacherId);

  if (updateError) {
    return { error: `Failed to update teacher: ${updateError.message}` };
  }

  revalidatePath("/teachers");
  revalidatePath(`/teachers/${teacherId}`);
  
  return { success: true, url: photoUrl };
}
