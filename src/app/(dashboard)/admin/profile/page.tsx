// Admin Profile Page - View and edit profile
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminProfileForm } from "./profile-form";

export const dynamic = "force-dynamic";

async function getAdminProfile(userId: string) {
  const supabase = await createServerSupabaseClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  return profile;
}

export default async function AdminProfilePage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getAdminProfile(user.id);

  if (!profile) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500">Manage your account information</p>
      </div>

      <AdminProfileForm profile={profile} userEmail={user.email || ""} />
    </div>
  );
}
