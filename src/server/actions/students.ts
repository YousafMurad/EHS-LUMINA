// Student Actions - Server actions for student CRUD
"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth } from "@/lib/auth/helpers";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

export interface CreateStudentData {
  name: string;
  father_name: string;
  mother_name?: string;
  father_cnic?: string;
  mother_cnic?: string;
  date_of_birth: string;
  gender: "male" | "female" | "other";
  class_id: string;
  section_id?: string;  // Made optional
  admission_date: string;
  address?: string;
  phone?: string;
  email?: string;
  cnic?: string;
  blood_group?: string;
  emergency_contact?: string;
  photo_url?: string;
  // Parent credentials
  parentEmail?: string;
  parentPassword?: string;
  // Link to existing parent
  existingParentId?: string;
}

// Find parent by CNIC (for sibling detection)
export async function findParentByCnic(cnic: string) {
  await requireAuth();
  
  const supabase = await createServerSupabaseClient();
  
  // Search for students with matching father or mother CNIC
  const { data: students, error } = await supabase
    .from("students")
    .select(`
      id,
      father_cnic,
      mother_cnic,
      parent_students!inner(
        parent_id,
        profiles:parent_id(
          id,
          email,
          name
        )
      )
    `)
    .or(`father_cnic.eq.${cnic},mother_cnic.eq.${cnic}`)
    .limit(1);
  
  if (error || !students || students.length === 0) {
    return { success: false, parent: null };
  }
  
  // Get the parent info from the first matching student
  const parentStudentLink = students[0]?.parent_students?.[0];
  if (!parentStudentLink?.profiles) {
    return { success: false, parent: null };
  }
  
  const profile = parentStudentLink.profiles as unknown as { id: string; email: string; name: string };
  
  // Count how many children this parent has
  const { count } = await supabase
    .from("parent_students")
    .select("*", { count: "exact", head: true })
    .eq("parent_id", profile.id);
  
  return { 
    success: true, 
    parent: {
      id: profile.id,
      email: profile.email || "",
      name: profile.name || "Parent",
      childrenCount: count || 0
    }
  };
}

export async function createStudent(data: CreateStudentData) {
  await requireAuth();
  
  const canCreate = await hasPermission(PERMISSIONS.STUDENTS_CREATE);
  if (!canCreate) {
    return { error: "You don't have permission to create students" };
  }

  const supabase = await createServerSupabaseClient();
  const adminClient = createAdminClient();

  // Extract parent credentials and existing parent ID from data
  const { parentEmail, parentPassword, existingParentId, ...studentData } = data;

  // Check if parent email is already in use (only if creating new account)
  if (parentEmail) {
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", parentEmail)
      .single();

    if (existingProfile) {
      return { error: "This parent email is already registered. Each parent must have a unique email." };
    }
  }

  // Generate registration number
  const year = new Date().getFullYear();
  const { count } = await supabase
    .from("students")
    .select("*", { count: "exact", head: true })
    .gte("created_at", `${year}-01-01`);

  const sequence = (count || 0) + 1;
  const registration_no = `EHS-${year.toString().slice(-2)}-${sequence.toString().padStart(4, "0")}`;

  // Get active session
  const { data: activeSession } = await supabase
    .from("sessions")
    .select("id")
    .eq("is_active", true)
    .single();

  if (!activeSession) {
    return { error: "No active session found. Please set an active session before adding students." };
  }

  // Clean up studentData - convert empty strings to null for optional fields
  const cleanedStudentData = {
    ...studentData,
    session_id: activeSession.id,
    section_id: studentData.section_id || null,
    mother_name: studentData.mother_name || null,
    father_cnic: studentData.father_cnic || null,
    mother_cnic: studentData.mother_cnic || null,
    address: studentData.address || null,
    phone: studentData.phone || null,
    email: studentData.email || null,
    cnic: studentData.cnic || null,
    blood_group: studentData.blood_group || null,
    emergency_contact: studentData.emergency_contact || null,
    photo_url: studentData.photo_url || null,
  };

  // Create student record first
  const { data: student, error } = await supabase
    .from("students")
    .insert({
      ...cleanedStudentData,
      registration_no,
      status: "active",
    } as Record<string, unknown>)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  // Link to existing parent (sibling case)
  if (existingParentId) {
    console.log("Linking student to existing parent:", existingParentId);
    
    const { error: linkError } = await adminClient
      .from("parent_students")
      .insert({
        parent_id: existingParentId,
        student_id: student.id,
        relationship: "father", // Default to father
        is_primary: true,
      });

    if (linkError) {
      console.error("Failed to link student to existing parent:", linkError.message);
      revalidatePath("/students");
      return { 
        success: true, 
        data: student, 
        warning: `Student created but linking to parent failed: ${linkError.message}` 
      };
    }
    
    console.log("Student linked to existing parent successfully");
    revalidatePath("/students");
    return { success: true, data: student };
  }

  // Create parent account if credentials provided
  if (parentEmail && parentPassword) {
    try {
      console.log("Creating parent account for:", parentEmail);
      
      // Create auth user using admin client
      const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
        email: parentEmail,
        password: parentPassword,
        email_confirm: true,
      });

      if (authError) {
        // Student created but parent account failed - log but don't fail
        console.error("Failed to create parent account:", authError.message);
        revalidatePath("/students");
        return { 
          success: true, 
          data: student, 
          warning: `Student created but parent account failed: ${authError.message}` 
        };
      }

      const parentUserId = authData.user.id;
      console.log("Parent auth user created:", parentUserId);

      // Create/update profile for parent using ADMIN CLIENT (bypasses RLS)
      // Using upsert because a trigger might auto-create the profile
      const { error: profileError } = await adminClient
        .from("profiles")
        .upsert({
          id: parentUserId,
          email: parentEmail,
          name: data.father_name, // Use father's name as parent name
          role: "parent",  // Use string directly to avoid any ROLES constant issues
          phone: data.phone || null,
          is_active: true,
        }, { onConflict: 'id' });

      if (profileError) {
        console.error("Failed to create parent profile:", profileError.message);
        // Try to clean up auth user
        await adminClient.auth.admin.deleteUser(parentUserId);
        revalidatePath("/students");
        return { 
          success: true, 
          data: student, 
          warning: `Student created but parent profile failed: ${profileError.message}` 
        };
      }
      
      console.log("Parent profile created successfully");

      // Link parent to student using ADMIN CLIENT
      const { error: linkError } = await adminClient
        .from("parent_students")
        .insert({
          parent_id: parentUserId,
          student_id: student.id,
          relationship: "father", // Default to father
          is_primary: true,
        });

      if (linkError) {
        console.error("Failed to link parent to student:", linkError.message);
        revalidatePath("/students");
        return { 
          success: true, 
          data: student, 
          warning: `Student and parent created but linking failed: ${linkError.message}` 
        };
      }
      
      console.log("Parent linked to student successfully");

    } catch (err) {
      console.error("Error creating parent account:", err);
      revalidatePath("/students");
      return { 
        success: true, 
        data: student, 
        warning: "Student created but parent account creation encountered an error" 
      };
    }
  }

  revalidatePath("/students");
  return { success: true, data: student };
}

export async function updateStudent(id: string, data: Partial<CreateStudentData>) {
  await requireAuth();
  
  const canEdit = await hasPermission(PERMISSIONS.STUDENTS_EDIT);
  if (!canEdit) {
    return { error: "You don't have permission to edit students" };
  }

  const supabase = await createServerSupabaseClient();

  const { data: student, error } = await supabase
    .from("students")
    .update(data as Record<string, unknown>)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/students");
  revalidatePath(`/students/${id}`);
  return { success: true, data: student };
}

export async function deleteStudent(id: string) {
  await requireAuth();
  
  const canDelete = await hasPermission(PERMISSIONS.STUDENTS_DELETE);
  if (!canDelete) {
    return { error: "You don't have permission to delete students" };
  }

  const supabase = await createServerSupabaseClient();

  // Soft delete - mark as inactive
  const { error } = await supabase
    .from("students")
    .update({ status: "deleted", deleted_at: new Date().toISOString() } as Record<string, unknown>)
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/students");
  return { success: true };
}

export async function uploadStudentPhoto(id: string, formData: FormData) {
  await requireAuth();
  
  const file = formData.get("photo") as File;
  if (!file) {
    return { error: "No file provided" };
  }

  const supabase = await createServerSupabaseClient();

  // Upload to storage
  const fileExt = file.name.split(".").pop();
  const fileName = `${id}.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from("student-photos")
    .upload(fileName, file, { upsert: true });

  if (uploadError) {
    return { error: uploadError.message };
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from("student-photos")
    .getPublicUrl(fileName);

  // Update student record
  const { error } = await supabase
    .from("students")
    .update({ photo_url: publicUrl } as Record<string, unknown>)
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/students/${id}`);
  return { success: true, url: publicUrl };
}
