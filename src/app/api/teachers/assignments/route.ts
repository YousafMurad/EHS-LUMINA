// Teacher Assignments API - Create and delete teacher-class assignments
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || !["super_admin", "admin", "operator"].includes(profile.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { teacherId, classId, sectionId, subjectId, isClassTeacher } = body;

    // Validate required fields
    if (!teacherId || !classId) {
      return NextResponse.json(
        { error: "Teacher and class are required" },
        { status: 400 }
      );
    }

    // Check if assignment already exists
    let query = supabase
      .from("teacher_class_assignments")
      .select("id")
      .eq("teacher_id", teacherId)
      .eq("class_id", classId);

    if (sectionId) {
      query = query.eq("section_id", sectionId);
    } else {
      query = query.is("section_id", null);
    }

    if (subjectId) {
      query = query.eq("subject_id", subjectId);
    } else {
      query = query.is("subject_id", null);
    }

    const { data: existing } = await query;

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: "This assignment already exists" },
        { status: 400 }
      );
    }

    // Create assignment
    const { data, error } = await supabase
      .from("teacher_class_assignments")
      .insert({
        teacher_id: teacherId,
        class_id: classId,
        section_id: sectionId || null,
        subject_id: subjectId || null,
        is_class_teacher: isClassTeacher || false,
      } as never)
      .select()
      .single();

    if (error) {
      console.error("Error creating assignment:", error);
      return NextResponse.json(
        { error: "Failed to create assignment" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Assignment create error:", error);
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || !["super_admin", "admin", "operator"].includes(profile.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const assignmentId = searchParams.get("id");

    if (!assignmentId) {
      return NextResponse.json(
        { error: "Assignment ID is required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("teacher_class_assignments")
      .delete()
      .eq("id", assignmentId);

    if (error) {
      console.error("Error deleting assignment:", error);
      return NextResponse.json(
        { error: "Failed to delete assignment" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Assignment delete error:", error);
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    );
  }
}
