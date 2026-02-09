// Header Component - Top navigation bar
"use client";

import { Avatar, Dropdown, DropdownItem } from "@/components/ui";

interface HeaderProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
  onLogout?: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      {/* Left side - Search or breadcrumb */}
      <div className="flex items-center gap-4">
        {/* Search bar placeholder */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-64 px-4 py-2 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        </div>
      </div>

      {/* Right side - Notifications and user menu */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-gray-500 hover:text-gray-700">
          🔔
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User menu */}
        {user && (
          <Dropdown
            trigger={
              <div className="flex items-center gap-3 cursor-pointer">
                <Avatar src={user.avatar} alt={user.name} size="sm" />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-700">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
              </div>
            }
            align="right"
          >
            <DropdownItem>Profile</DropdownItem>
            <DropdownItem>Settings</DropdownItem>
            <DropdownItem onClick={onLogout}>Logout</DropdownItem>
          </Dropdown>
        )}
      </div>
    </header>
  );
}
