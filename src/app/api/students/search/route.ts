// API Route - Search Students
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query || query.length < 2) {
    return NextResponse.json({ students: [] });
  }

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("students")
    .select(`
      id,
      name,
      registration_no,
      father_name,
      photo_url,
      classes(name),
      sections(name)
    `)
    .eq("status", "active")
    .or(`name.ilike.%${query}%,registration_no.ilike.%${query}%,father_name.ilike.%${query}%`)
    .limit(10);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const students = (data || []).map((s: any) => ({
    id: s.id,
    name: s.name,
    registration_no: s.registration_no,
    father_name: s.father_name,
    photo_url: s.photo_url,
    class_name: s.classes?.name || "",
    section_name: s.sections?.name || "",
  }));

  return NextResponse.json({ students });
}
