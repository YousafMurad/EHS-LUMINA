// Class Queries - Server-side data fetching
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getClasses(activeOnly: boolean = true) {
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("classes")
    .select(`
      *,
      sections(id, name, is_active),
      students(id)
    `)
    .order("grade_level");

  if (activeOnly) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;

  if (error) throw error;

  // Add student count
  const classesWithCount = (data || []).map((cls: any) => ({
    ...cls,
    student_count: cls.students?.length || 0,
    section_count: cls.sections?.filter((s: any) => s.is_active).length || 0,
  }));

  return classesWithCount;
}

export async function getClassById(id: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("classes")
    .select(`
      *,
      sections(
        id, name, capacity, is_active,
        teachers(id, name)
      ),
      fee_structures(*)
    `)
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function getClassesWithStudentCount() {
  const supabase = await createServerSupabaseClient();

  interface ClassRow { id: string; name: string; grade_level: number }
  interface StudentClassRow { class_id: string }

  const { data: classesData, error } = await supabase
    .from("classes")
    .select("id, name, grade_level")
    .eq("is_active", true)
    .order("grade_level");

  if (error) throw error;

  const classes = (classesData || []) as ClassRow[];

  // Get student counts
  const classIds = classes.map((c) => c.id);
  const { data: studentCountsData } = await supabase
    .from("students")
    .select("class_id")
    .in("class_id", classIds)
    .eq("status", "active");

  const studentCounts = (studentCountsData || []) as StudentClassRow[];

  const countMap: Record<string, number> = {};
  studentCounts.forEach((s) => {
    countMap[s.class_id] = (countMap[s.class_id] || 0) + 1;
  });

  return classes.map((cls) => ({
    ...cls,
    student_count: countMap[cls.id] || 0,
  }));
}

export async function getClassOptions() {
  const supabase = await createServerSupabaseClient();

  interface ClassOptionRow { id: string; name: string }

  const { data, error } = await supabase
    .from("classes")
    .select("id, name")
    .eq("is_active", true)
    .order("grade_level");

  if (error) throw error;

  const classes = (data || []) as ClassOptionRow[];

  return classes.map((cls) => ({
    value: cls.id,
    label: cls.name,
  }));
}
