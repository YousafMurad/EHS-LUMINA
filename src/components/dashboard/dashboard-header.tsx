// Dashboard Header - Top navigation bar with search and user menu
"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Calendar,
  HelpCircle,
} from "lucide-react";

interface DashboardHeaderProps {
  userName: string;
  userRole: string;
  userEmail?: string;
  onLogout: () => void;
  currentSession?: string;
}

export function DashboardHeader({
  userName,
  userRole,
  userEmail,
  onLogout,
  currentSession = "2025-2026",
}: DashboardHeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mock notifications
  const notifications = [
    { id: 1, title: "Fee payment received", message: "Rs. 5,000 from Ahmad Khan", time: "2 min ago", unread: true },
    { id: 2, title: "New student registered", message: "Maria Bibi - Class 5A", time: "1 hour ago", unread: true },
    { id: 3, title: "Session reminder", message: "Academic year ending in 30 days", time: "3 hours ago", unread: false },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Get profile link based on user role
  const profileLink = useMemo(() => {
    const roleLinks: Record<string, string> = {
      super_admin: "/admin/profile",
      admin: "/admin/profile",
      operator: "/operators/profile",
      teacher: "/teachers/profile",
      parent: "/parent/profile",
    };
    return roleLinks[userRole.toLowerCase().replace(" ", "_")] || "/settings/profile";
  }, [userRole]);

  // Check if settings should be shown (only for super_admin and admin)
  const showSettings = useMemo(() => {
    const role = userRole.toLowerCase().replace(" ", "_");
    return ["super_admin", "admin"].includes(role);
  }, [userRole]);

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left side - Spacer for mobile menu button + Search */}
      <div className="flex items-center gap-4">
        {/* Spacer for mobile menu button */}
        <div className="lg:hidden w-10" />

        {/* Search Bar */}
        <div className="hidden sm:block relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search students, classes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 lg:w-80 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Right side - Session, Notifications, User */}
      <div className="flex items-center gap-2 lg:gap-4">
        {/* Current Session Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
          <Calendar size={16} />
          <span>{currentSession}</span>
        </div>

        {/* Help Button */}
        <button className="hidden lg:flex p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <HelpCircle size={20} />
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
                <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                  Mark all as read
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                      notification.unread ? "bg-blue-50/50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {notification.unread && (
                        <span className="mt-1.5 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                      )}
                      <div className={notification.unread ? "" : "ml-5"}>
                        <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                        <p className="text-sm text-gray-500">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                <Link
                  href="/notifications"
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View all notifications →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 lg:gap-3 p-1.5 lg:p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 lg:w-9 lg:h-9 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow">
              <span className="text-sm font-bold text-blue-900">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-medium text-gray-800">{userName}</p>
              <p className="text-xs text-gray-500">{userRole}</p>
            </div>
            <ChevronDown
              size={16}
              className={`hidden lg:block text-gray-400 transition-transform ${
                isProfileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
              {/* User Info */}
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-800">{userName}</p>
                <p className="text-xs text-gray-500">{userEmail || "admin@ehs.edu.pk"}</p>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <Link
                  href={profileLink}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <User size={16} className="text-gray-400" />
                  My Profile
                </Link>
                {showSettings && (
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Settings size={16} className="text-gray-400" />
                    Settings
                  </Link>
                )}
              </div>

              {/* Logout */}
              <div className="border-t border-gray-200 py-1">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onLogout();
                  }}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
