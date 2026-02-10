// Parent Actions - Server actions for parent management and authentication
"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth } from "@/lib/auth/helpers";
import { revalidatePath } from "next/cache";

// Generate parent credentials when adding a student
export async function createParentAccount(
  studentId: string,
  parentEmail: string,
  parentPhone: string,
  fatherName: string
) {
  await requireAuth();
  
  const adminSupabase = createAdminClient();
  const supabase = await createServerSupabaseClient();

  // Generate a temporary password
  const tempPassword = `Parent@${parentPhone.slice(-4)}${new Date().getFullYear()}`;

  try {
    // Create auth user
    const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
      email: parentEmail,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        name: fatherName,
        role: "parent",
      },
    });

    if (authError) {
      // If user already exists, link to existing
      if (authError.message.includes("already been registered")) {
        // Find existing user
        const { data: existingUser } = await adminSupabase.auth.admin.listUsers();
        const parentUser = existingUser?.users?.find((u) => u.email === parentEmail);
        
        if (parentUser) {
          // Link student to existing parent
          await supabase
            .from("parent_students")
            .upsert({
              parent_id: parentUser.id,
              student_id: studentId,
              relationship: "parent",
              is_primary: true,
            } as never, { onConflict: "parent_id,student_id" });

          return { 
            success: true, 
            data: { 
              email: parentEmail, 
              isExisting: true,
              message: "Student linked to existing parent account" 
            } 
          };
        }
      }
      return { error: authError.message };
    }

    if (!authData.user) {
      return { error: "Failed to create user" };
    }

    // Create profile
    await supabase
      .from("profiles")
      .upsert({
        id: authData.user.id,
        email: parentEmail,
        name: fatherName,
        role: "parent",
        phone: parentPhone,
        is_active: true,
      } as never, { onConflict: "id" });

    // Link parent to student
    await supabase
      .from("parent_students")
      .insert({
        parent_id: authData.user.id,
        student_id: studentId,
        relationship: "parent",
        is_primary: true,
      } as never);

    // Update student with parent info
    await supabase
      .from("students")
      .update({
        parent_email: parentEmail,
        parent_phone: parentPhone,
      })
      .eq("id", studentId);

    revalidatePath("/students");
    
    return {
      success: true,
      data: {
        email: parentEmail,
        password: tempPassword,
        message: "Parent account created successfully",
      },
    };
  } catch (error) {
    console.error("Error creating parent account:", error);
    return { error: "Failed to create parent account" };
  }
}

// Get parent's children
export async function getParentChildren(parentId?: string) {
  const user = await requireAuth();
  const supabase = await createServerSupabaseClient();

  const targetParentId = parentId || user?.id;

  const { data, error } = await supabase
    .from("parent_students")
    .select(`
      id,
      relationship,
      is_primary,
      students:student_id (
        id,
        registration_no,
        name,
        father_name,
        date_of_birth,
        gender,
        photo_url,
        status,
        classes:class_id (id, name),
        sections:section_id (id, name)
      )
    `)
    .eq("parent_id", targetParentId!);

  if (error) {
    return { error: error.message };
  }

  return { success: true, data };
}

// Get child's attendance for parent view
export async function getChildAttendance(
  studentId: string,
  month?: number,
  year?: number
) {
  const user = await requireAuth();
  const supabase = await createServerSupabaseClient();

  // Verify parent has access to this student
  const { data: link } = await supabase
    .from("parent_students")
    .select("id")
    .eq("parent_id", user?.id!)
    .eq("student_id", studentId)
    .single();

  if (!link) {
    return { error: "You do not have access to this student's data" };
  }

  const currentDate = new Date();
  const targetMonth = month || currentDate.getMonth() + 1;
  const targetYear = year || currentDate.getFullYear();

  const startDate = new Date(targetYear, targetMonth - 1, 1).toISOString().split("T")[0];
  const endDate = new Date(targetYear, targetMonth, 0).toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("student_id", studentId)
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: false });

  if (error) {
    return { error: error.message };
  }

  // Calculate summary
  const present = data?.filter((a) => a.status === "present").length || 0;
  const absent = data?.filter((a) => a.status === "absent").length || 0;
  const late = data?.filter((a) => a.status === "late").length || 0;
  const halfDay = data?.filter((a) => a.attendance_type === "half_day").length || 0;
  const total = data?.length || 0;

  return {
    success: true,
    data: {
      records: data,
      summary: {
        present,
        absent,
        late,
        halfDay,
        total,
        percentage: total > 0 ? Math.round(((present + late + halfDay * 0.5) / total) * 100) : 0,
      },
      month: targetMonth,
      year: targetYear,
    },
  };
}

// Get child's results for parent view
export async function getChildResults(studentId: string, sessionId?: string) {
  const user = await requireAuth();
  const supabase = await createServerSupabaseClient();

  // Verify parent has access to this student
  const { data: link } = await supabase
    .from("parent_students")
    .select("id")
    .eq("parent_id", user?.id!)
    .eq("student_id", studentId)
    .single();

  if (!link) {
    return { error: "You do not have access to this student's data" };
  }

  let query = supabase
    .from("student_results")
    .select(`
      id,
      total_marks,
      obtained_marks,
      grade,
      remarks,
      is_absent,
      created_at,
      sessions:session_id (id, name),
      exam_types:exam_type_id (id, name, code),
      subjects:subject_id (id, name, code),
      classes:class_id (id, name)
    `)
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });

  if (sessionId) {
    query = query.eq("session_id", sessionId);
  }

  const { data, error } = await query;

  if (error) {
    return { error: error.message };
  }

  // Group by exam type
  const grouped: Record<string, typeof data> = {};
  data?.forEach((result) => {
    const examType = (result.exam_types as unknown as { name: string })?.name || "Unknown";
    if (!grouped[examType]) {
      grouped[examType] = [];
    }
    grouped[examType].push(result);
  });

  return { success: true, data: { all: data, grouped } };
}

// Get child's fee status for parent view
export async function getChildFeeStatus(studentId: string) {
  const user = await requireAuth();
  const supabase = await createServerSupabaseClient();

  // Verify parent has access to this student
  const { data: link } = await supabase
    .from("parent_students")
    .select("id")
    .eq("parent_id", user?.id!)
    .eq("student_id", studentId)
    .single();

  if (!link) {
    return { error: "You do not have access to this student's data" };
  }

  // Get fee records
  const { data: fees, error: feeError } = await supabase
    .from("student_fees")
    .select("*")
    .eq("student_id", studentId)
    .order("fee_year", { ascending: false })
    .order("fee_month", { ascending: false });

  if (feeError) {
    return { error: feeError.message };
  }

  // Get payment history
  const { data: payments, error: paymentError } = await supabase
    .from("payments")
    .select("*")
    .eq("student_id", studentId)
    .order("payment_date", { ascending: false })
    .limit(20);

  if (paymentError) {
    return { error: paymentError.message };
  }

  // Calculate totals
  const totalDue = fees?.reduce((sum, f) => sum + (f.amount - (f.paid_amount || 0)), 0) || 0;
  const totalPaid = fees?.reduce((sum, f) => sum + (f.paid_amount || 0), 0) || 0;
  const pendingMonths = fees?.filter((f) => f.status === "pending").length || 0;

  return {
    success: true,
    data: {
      fees,
      payments,
      summary: {
        totalDue,
        totalPaid,
        pendingMonths,
      },
    },
  };
}

// Submit suggestion/complaint
export async function submitSuggestionComplaint(data: {
  studentId?: string;
  type: "suggestion" | "complaint" | "feedback" | "inquiry";
  subject: string;
  message: string;
  priority?: "low" | "normal" | "high" | "urgent";
  isAnonymous?: boolean;
}) {
  const user = await requireAuth();
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("suggestions_complaints")
    .insert({
      parent_id: user?.id,
      student_id: data.studentId || null,
      type: data.type,
      subject: data.subject,
      message: data.message,
      priority: data.priority || "normal",
      is_anonymous: data.isAnonymous || false,
      status: "pending",
    } as never);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/parent/complaints");
  return { success: true };
}

// Get parent's suggestions/complaints
export async function getParentSuggestionsComplaints(parentId?: string) {
  const user = await requireAuth();
  const supabase = await createServerSupabaseClient();

  const targetParentId = parentId || user?.id;

  const { data, error } = await supabase
    .from("suggestions_complaints")
    .select(`
      id,
      type,
      subject,
      message,
      priority,
      status,
      response,
      responded_at,
      is_anonymous,
      created_at,
      students:student_id (id, name, registration_no)
    `)
    .eq("parent_id", targetParentId!)
    .order("created_at", { ascending: false });

  if (error) {
    return { error: error.message };
  }

  return { success: true, data };
}

// Get all suggestions/complaints (for admin/operator)
export async function getAllSuggestionsComplaints(status?: string) {
  await requireAuth();
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("suggestions_complaints")
    .select(`
      id,
      type,
      subject,
      message,
      priority,
      status,
      response,
      responded_at,
      is_anonymous,
      created_at,
      updated_at,
      profiles:parent_id (id, name, email, phone),
      students:student_id (id, name, registration_no)
    `)
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    return { error: error.message };
  }

  return { success: true, data };
}

// Respond to suggestion/complaint (admin/operator)
export async function respondToSuggestionComplaint(
  id: string,
  response: string,
  newStatus: "in_progress" | "resolved" | "closed"
) {
  const user = await requireAuth();
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("suggestions_complaints")
    .update({
      response,
      status: newStatus,
      responded_by: user?.id,
      responded_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

// Link additional child to parent
export async function linkChildToParent(parentId: string, studentId: string, relationship: string) {
  await requireAuth();
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("parent_students")
    .insert({
      parent_id: parentId,
      student_id: studentId,
      relationship: relationship as "father" | "mother" | "guardian" | "parent",
      is_primary: false,
    } as never);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/students");
  return { success: true };
}
