// Section Queries - Server-side data fetching
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getSections(classId?: string) {
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("sections")
    .select(`
      *,
      classes(id, name, grade_level),
      teachers(id, name)
    `)
    .eq("is_active", true)
    .order("name");

  if (classId) {
    query = query.eq("class_id", classId);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data || [];
}

export async function getSectionById(id: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("sections")
    .select(`
      *,
      classes(id, name, grade_level),
      teachers(id, name, phone),
      students(id, name, registration_no, photo_url)
    `)
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function getSectionsByClass(classId: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("sections")
    .select("id, name, capacity")
    .eq("class_id", classId)
    .eq("is_active", true)
    .order("name");

  if (error) throw error;

  return data || [];
}

export async function getSectionOptions(classId?: string) {
  const sections = await getSections(classId);

  return sections.map((section: any) => ({
    value: section.id,
    label: classId ? section.name : `${section.classes?.name} - ${section.name}`,
  }));
}

export async function getSectionWithStudentCount(classId: string) {
  const supabase = await createServerSupabaseClient();

  const { data: sections, error } = await supabase
    .from("sections")
    .select("id, name, capacity")
    .eq("class_id", classId)
    .eq("is_active", true)
    .order("name");

  if (error) throw error;

  // Get student counts
  const sectionIds = (sections || []).map((s) => s.id);
  const { data: studentCounts } = await supabase
    .from("students")
    .select("section_id")
    .in("section_id", sectionIds)
    .eq("status", "active");

  const countMap: Record<string, number> = {};
  (studentCounts || []).forEach((s) => {
    countMap[s.section_id] = (countMap[s.section_id] || 0) + 1;
  });

  return (sections || []).map((section) => ({
    ...section,
    student_count: countMap[section.id] || 0,
  }));
}
