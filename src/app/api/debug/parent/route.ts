// Debug API - Check parent accounts (temporary)
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email");
    
    if (!email) {
      return NextResponse.json({ message: "Email parameter required" }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    const adminClient = createAdminClient();

    // Check profile table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .single();

    // Check auth users (admin only)
    const { data: authUsers, error: authError } = await adminClient.auth.admin.listUsers();
    
    const authUser = authUsers?.users?.find(u => u.email === email);

    // Check parent_students table
    let linkedStudents = null;
    if (profile?.id) {
      const { data: links } = await supabase
        .from("parent_students")
        .select("*, students(*)")
        .eq("parent_id", profile.id);
      linkedStudents = links;
    }

    return NextResponse.json({
      email,
      profile: profile || null,
      profileError: profileError?.message || null,
      authUserExists: !!authUser,
      authUserDetails: authUser ? {
        id: authUser.id,
        email: authUser.email,
        emailConfirmed: authUser.email_confirmed_at,
        createdAt: authUser.created_at,
      } : null,
      linkedStudents,
    });
  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json({ message: "Error", error: String(error) }, { status: 500 });
  }
}
