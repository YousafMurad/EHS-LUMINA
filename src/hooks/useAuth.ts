"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Profile, SessionUser, AuthState, Role } from "@/types";

// Type definitions for Supabase query results
interface ProfileData {
  name: string;
  role: Role;
  avatar_url: string | null;
}

interface PermissionData {
  permission: string;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const supabase = createClient();

  const fetchUser = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
        return;
      }

      // Fetch profile with proper typing
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      const profile = profileData as ProfileData | null;

      // Fetch permissions with proper typing
      const { data: userPermissionsData } = await supabase
        .from("user_permissions")
        .select("permission")
        .eq("user_id", user.id);

      const { data: rolePermissionsData } = await supabase
        .from("role_permissions")
        .select("permission")
        .eq("role", profile?.role || "student");

      const userPermissions = (userPermissionsData || []) as PermissionData[];
      const rolePermissions = (rolePermissionsData || []) as PermissionData[];

      const permissions = [
        ...rolePermissions.map((p) => p.permission),
        ...userPermissions.map((p) => p.permission),
      ];

      const sessionUser: SessionUser = {
        id: user.id,
        email: user.email || "",
        name: profile?.name || user.email || "",
        role: profile?.role || "student",
        avatar_url: profile?.avatar_url || undefined,
        permissions: [...new Set(permissions)],
      };

      setState({
        user: sessionUser,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, [supabase]);

  useEffect(() => {
    fetchUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchUser();
      } else {
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, fetchUser]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  }, [supabase]);

  return {
    ...state,
    signOut,
    refresh: fetchUser,
  };
}
