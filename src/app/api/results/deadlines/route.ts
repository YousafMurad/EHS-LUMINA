// Results Deadlines API - Create and manage result submission deadlines
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
    const { sessionId, classId, examTypeId, startDate, endDate, isOpen } = body;

    // Validate required fields
    if (!sessionId || !classId || !examTypeId || !startDate || !endDate) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if deadline already exists
    const { data: existing } = await supabase
      .from("result_deadlines")
      .select("id")
      .eq("session_id", sessionId)
      .eq("class_id", classId)
      .eq("exam_type_id", examTypeId);

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: "A deadline for this combination already exists" },
        { status: 400 }
      );
    }

    // Create deadline
    const { data, error } = await supabase
      .from("result_deadlines")
      .insert({
        session_id: sessionId,
        class_id: classId,
        exam_type_id: examTypeId,
        start_date: startDate,
        end_date: endDate,
        is_open: isOpen ?? true,
        created_by: user.id,
      } as never)
      .select()
      .single();

    if (error) {
      console.error("Error creating deadline:", error);
      return NextResponse.json(
        { error: "Failed to create deadline" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Deadline create error:", error);
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
    const deadlineId = searchParams.get("id");

    if (!deadlineId) {
      return NextResponse.json(
        { error: "Deadline ID is required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("result_deadlines")
      .delete()
      .eq("id", deadlineId);

    if (error) {
      console.error("Error deleting deadline:", error);
      return NextResponse.json(
        { error: "Failed to delete deadline" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Deadline delete error:", error);
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    );
  }
}
