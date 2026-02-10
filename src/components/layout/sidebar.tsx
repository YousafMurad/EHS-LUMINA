// Sidebar Component - Main navigation sidebar
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  children?: NavItem[];
}

interface SidebarProps {
  items: NavItem[];
  collapsed?: boolean;
}

export function Sidebar({ items, collapsed = false }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <aside className={`bg-white border-r border-gray-200 h-screen ${collapsed ? "w-16" : "w-64"}`}>
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        {/* EHS Logo will go here */}
        <span className="font-bold text-primary-600">EHS ERP</span>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActive(item.href)
                ? "bg-primary-50 text-primary-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
