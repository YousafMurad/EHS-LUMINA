// Toggle Deadline API - Open/close result submission deadline
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
    const { id, isOpen } = body;

    if (!id || typeof isOpen !== "boolean") {
      return NextResponse.json(
        { error: "Deadline ID and status are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("result_deadlines")
      .update({ is_open: isOpen })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error toggling deadline:", error);
      return NextResponse.json(
        { error: "Failed to toggle deadline" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Deadline toggle error:", error);
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    );
  }
}
