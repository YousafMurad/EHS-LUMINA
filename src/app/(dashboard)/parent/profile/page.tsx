// Parent Profile Page - View and edit profile
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ParentProfileForm } from "./profile-form";

export const dynamic = "force-dynamic";

async function getParentProfile(parentId: string) {
  const supabase = await createServerSupabaseClient();

  // Get profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", parentId)
    .single();

  // Get children count
  const { data: children } = await supabase
    .from("parent_students")
    .select("id")
    .eq("parent_id", parentId);

  return { 
    profile, 
    childrenCount: children?.length || 0,
  };
}

export default async function ParentProfilePage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const data = await getParentProfile(user.id);

  if (!data.profile) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500">Manage your account information</p>
      </div>

      <ParentProfileForm 
        profile={data.profile} 
        userEmail={user.email || ""} 
        childrenCount={data.childrenCount}
      />
    </div>
  );
}
