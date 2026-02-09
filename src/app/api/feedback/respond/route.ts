// Feedback Respond API - Respond to parent feedback
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
    const { feedbackId, response, status } = body;

    if (!feedbackId) {
      return NextResponse.json(
        { error: "Feedback ID is required" },
        { status: 400 }
      );
    }

    // Build update object
    const updateData: Record<string, unknown> = {};

    if (response) {
      updateData.response = response;
      updateData.responded_at = new Date().toISOString();
      updateData.responded_by = user.id;
    }

    if (status) {
      updateData.status = status;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "Nothing to update" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("suggestions_complaints")
      .update(updateData)
      .eq("id", feedbackId)
      .select()
      .single();

    if (error) {
      console.error("Error updating feedback:", error);
      return NextResponse.json(
        { error: "Failed to update feedback" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Feedback respond error:", error);
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    );
  }
}
