"use client";

import { useMemo, useCallback } from "react";
import { useAuth } from "./useAuth";
import type { Role } from "@/types";
import { ROLE_HIERARCHY } from "@/lib/auth/roles";

export function usePermissions() {
  const { user, isLoading } = useAuth();

  const permissions = useMemo(() => {
    return user?.permissions || [];
  }, [user]);

  const role = useMemo(() => {
    return user?.role || null;
  }, [user]);

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!user) return false;

      // Super admin has all permissions
      if (user.role === "super_admin") return true;

      return permissions.includes(permission);
    },
    [user, permissions]
  );

  const hasAnyPermission = useCallback(
    (permissionList: string[]): boolean => {
      if (!user) return false;

      if (user.role === "super_admin") return true;

      return permissionList.some((p) => permissions.includes(p));
    },
    [user, permissions]
  );

  const hasAllPermissions = useCallback(
    (permissionList: string[]): boolean => {
      if (!user) return false;

      if (user.role === "super_admin") return true;

      return permissionList.every((p) => permissions.includes(p));
    },
    [user, permissions]
  );

  const hasRole = useCallback(
    (requiredRole: Role): boolean => {
      if (!user) return false;

      const userLevel = ROLE_HIERARCHY[user.role] || 0;
      const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;

      return userLevel >= requiredLevel;
    },
    [user]
  );

  const isAdmin = useMemo(() => {
    return role === "super_admin" || role === "admin";
  }, [role]);

  const isSuperAdmin = useMemo(() => {
    return role === "super_admin";
  }, [role]);

  return {
    permissions,
    role,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    isAdmin,
    isSuperAdmin,
    isLoading,
  };
}
