// Dashboard Layout Client - Client component for the dashboard shell
"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { signOut } from "@/server/actions/auth";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string | null;
}

interface SchoolSettings {
  name: string;
  tagline: string;
  logoUrl: string | null;
}

interface DashboardLayoutClientProps {
  children: ReactNode;
  user: User;
  currentSession: string;
  schoolSettings?: SchoolSettings;
}

export function DashboardLayoutClient({
  children,
  user,
  currentSession,
  schoolSettings,
}: DashboardLayoutClientProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  // Format role for display
  const formatRole = (role: string) => {
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar
        onLogout={handleLogout}
        userName={user.name}
        userRole={formatRole(user.role)}
        schoolName={schoolSettings?.name || "EHS School"}
        schoolTagline={schoolSettings?.tagline || "Management System"}
        schoolLogoUrl={schoolSettings?.logoUrl || null}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Header */}
        <DashboardHeader
          userName={user.name}
          userRole={formatRole(user.role)}
          userEmail={user.email}
          onLogout={handleLogout}
          currentSession={currentSession}
        />

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
