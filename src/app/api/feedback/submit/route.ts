// Feedback Submit API - Submit suggestions/complaints
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, studentId, subject, message, parentId } = body;

    // Validate required fields
    if (!type || !studentId || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify parent has access to this student
    const { data: link } = await supabase
      .from("parent_students")
      .select("id")
      .eq("parent_id", parentId || user.id)
      .eq("student_id", studentId)
      .single();

    if (!link) {
      return NextResponse.json(
        { error: "You do not have access to this student" },
        { status: 403 }
      );
    }

    // Insert feedback
    const { data, error } = await supabase
      .from("suggestions_complaints")
      .insert({
        parent_id: parentId || user.id,
        student_id: studentId,
        type,
        subject,
        message,
        status: "pending",
      } as never)
      .select()
      .single();

    if (error) {
      console.error("Error submitting feedback:", error);
      return NextResponse.json(
        { error: "Failed to submit feedback" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Feedback submit error:", error);
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    );
  }
}
