// Operator Profile Page - View and edit profile
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OperatorProfileForm } from "./profile-form";

export const dynamic = "force-dynamic";

async function getOperatorProfile(userId: string) {
  const supabase = await createServerSupabaseClient();

  // Get profile from profiles table only - no external join needed
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return profile;
}

export default async function OperatorProfilePage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getOperatorProfile(user.id);

  // If no profile, show setup message instead of redirecting
  if (!profile) {
    return (
      <div className="space-y-6">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md mx-auto mt-20">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-4">
            Your profile has not been set up yet. Please contact the administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500">View and manage your account information</p>
      </div>

      <OperatorProfileForm 
        profile={profile} 
        userEmail={user.email || ""} 
      />
    </div>
  );
}
