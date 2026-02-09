// Dashboard Sidebar - Professional navigation with Gold & Blue theme
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  ArrowUpDown,
  Calendar,
  FileText,
  Award,
  Settings,
  UserCog,
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  X,
  ClipboardList,
  UserCircle,
  MessageSquare,
  FileBarChart,
  Clock,
} from "lucide-react";

// Logo component with error handling
function SidebarLogo({ logoUrl, schoolName }: { logoUrl: string | null; schoolName: string }) {
  const [imageError, setImageError] = useState(false);

  if (logoUrl && !imageError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img 
        src={logoUrl} 
        alt={schoolName}
        className="w-10 h-10 rounded-lg object-cover shadow-lg"
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg">
      <span className="text-lg font-bold text-blue-900">{schoolName.substring(0, 3).toUpperCase()}</span>
    </div>
  );
}

type UserRole = "super_admin" | "admin" | "accountant" | "teacher" | "operator" | "student" | "parent";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  roles?: UserRole[]; // If empty/undefined, all roles can access
  children?: { title: string; href: string; roles?: UserRole[] }[];
}

// Role-based navigation configuration
const navigation: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard size={20} />,
    roles: ["super_admin", "admin", "accountant", "teacher", "operator"], // Exclude parent - they have their own
  },
  // Admin/Operator navigation items
  {
    title: "Students",
    href: "/students",
    icon: <Users size={20} />,
    roles: ["super_admin", "admin", "operator"],
    children: [
      { title: "All Students", href: "/students" },
      { title: "Add Student", href: "/students/new", roles: ["super_admin", "admin", "operator"] },
      { title: "Old Students", href: "/students/old" },
    ],
  },
  {
    title: "Classes",
    href: "/classes",
    icon: <GraduationCap size={20} />,
    roles: ["super_admin", "admin", "operator"],
    children: [
      { title: "All Classes", href: "/classes" },
      { title: "Add Class", href: "/classes/new", roles: ["super_admin", "admin"] },
    ],
  },
  {
    title: "Sections",
    href: "/sections",
    icon: <BookOpen size={20} />,
    roles: ["super_admin", "admin", "operator"],
    children: [
      { title: "All Sections", href: "/sections" },
      { title: "Add Section", href: "/sections/new", roles: ["super_admin", "admin"] },
    ],
  },
  {
    title: "Teachers",
    href: "/teachers",
    icon: <GraduationCap size={20} />,
    roles: ["super_admin", "admin", "operator"],
    children: [
      { title: "All Teachers", href: "/teachers" },
      { title: "Add Teacher", href: "/teachers/new", roles: ["super_admin", "admin", "operator"] },
      { title: "Class Assignments", href: "/teachers/assignments", roles: ["super_admin", "admin", "operator"] },
    ],
  },
  {
    title: "Operators",
    href: "/operators",
    icon: <UserCog size={20} />,
    roles: ["super_admin", "admin"],
    children: [
      { title: "All Operators", href: "/operators" },
      { title: "Add Operator", href: "/operators/new" },
    ],
  },
  {
    title: "Results",
    href: "/results",
    icon: <FileBarChart size={20} />,
    roles: ["super_admin", "admin", "operator"],
    children: [
      { title: "View Results", href: "/results" },
      { title: "Deadlines", href: "/results/deadlines", roles: ["super_admin", "admin", "operator"] },
      { title: "Subjects", href: "/results/subjects", roles: ["super_admin", "admin"] },
    ],
  },
  {
    title: "Feedback",
    href: "/feedback",
    icon: <MessageSquare size={20} />,
    roles: ["super_admin", "admin", "operator"],
  },
  // Teacher-specific navigation
  {
    title: "My Results",
    href: "/teachers/results",
    icon: <ClipboardList size={20} />,
    roles: ["teacher"],
  },
  {
    title: "My Profile",
    href: "/teachers/profile",
    icon: <UserCircle size={20} />,
    roles: ["teacher"],
  },
  // Parent-specific navigation
  {
    title: "My Children",
    href: "/parent",
    icon: <LayoutDashboard size={20} />,
    roles: ["parent"],
  },
  {
    title: "Attendance",
    href: "/parent/attendance",
    icon: <Clock size={20} />,
    roles: ["parent"],
  },
  {
    title: "Results",
    href: "/parent/results",
    icon: <FileBarChart size={20} />,
    roles: ["parent"],
  },
  {
    title: "Feedback",
    href: "/parent/complaints",
    icon: <MessageSquare size={20} />,
    roles: ["parent"],
  },
  {
    title: "My Profile",
    href: "/parent/profile",
    icon: <UserCircle size={20} />,
    roles: ["parent"],
  },
  // Operator profile
  {
    title: "My Profile",
    href: "/operators/profile",
    icon: <UserCircle size={20} />,
    roles: ["operator"],
  },
  // Admin profile
  {
    title: "My Profile",
    href: "/admin/profile",
    icon: <UserCircle size={20} />,
    roles: ["super_admin", "admin"],
  },
  {
    title: "Fees",
    href: "/fees",
    icon: <DollarSign size={20} />,
    roles: ["super_admin", "admin", "accountant", "operator"],
    children: [
      { title: "Overview", href: "/fees" },
      { title: "Fee Structures", href: "/fees/structures", roles: ["super_admin", "admin", "accountant"] },
      { title: "Collection", href: "/fees/collection", roles: ["super_admin", "admin", "accountant", "operator"] },
      { title: "Due Fees", href: "/fees/dues" },
      { title: "History", href: "/fees/history" },
    ],
  },
  {
    title: "Promotions",
    href: "/promotions",
    icon: <ArrowUpDown size={20} />,
    roles: ["super_admin", "admin"],
    children: [
      { title: "Promote Students", href: "/promotions" },
      { title: "Bulk Promotion", href: "/promotions/bulk" },
      { title: "History", href: "/promotions/history" },
    ],
  },
  {
    title: "Sessions",
    href: "/sessions",
    icon: <Calendar size={20} />,
    roles: ["super_admin", "admin"],
  },
  {
    title: "Reports",
    href: "/reports",
    icon: <FileText size={20} />,
    roles: ["super_admin", "admin", "accountant"],
    children: [
      { title: "Fee Reports", href: "/reports/fees" },
      { title: "Student Reports", href: "/reports/students" },
      { title: "Class Reports", href: "/reports/classes" },
      { title: "Attendance", href: "/reports/attendance" },
    ],
  },
  {
    title: "Certificates",
    href: "/certificates",
    icon: <Award size={20} />,
    roles: ["super_admin", "admin", "operator"],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings size={20} />,
    roles: ["super_admin", "admin"], // Removed operator and teacher
  },
];

// Filter navigation items based on user role
function getNavigationForRole(role: UserRole): NavItem[] {
  return navigation
    .filter((item) => !item.roles || item.roles.includes(role))
    .map((item) => ({
      ...item,
      children: item.children?.filter(
        (child) => !child.roles || child.roles.includes(role)
      ),
    }));
}

interface DashboardSidebarProps {
  onLogout: () => void;
  userName?: string;
  userRole?: string;
  schoolName?: string;
  schoolTagline?: string;
  schoolLogoUrl?: string | null;
}

export function DashboardSidebar({ 
  onLogout, 
  userName = "Admin", 
  userRole = "Super Admin",
  schoolName = "EHS School",
  schoolTagline = "Management System",
  schoolLogoUrl = null,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Get role-filtered navigation
  const roleKey = userRole.toLowerCase().replace(" ", "_") as UserRole;
  const filteredNavigation = getNavigationForRole(roleKey);

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]
    );
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  const isChildActive = (children?: { href: string }[]) => {
    return children?.some((child) => pathname === child.href || pathname.startsWith(child.href + "/"));
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-900 text-white rounded-lg shadow-lg"
      >
        <Menu size={24} />
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-900 to-blue-950 transform transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo Section */}
          <div className="h-16 flex items-center gap-3 px-4 border-b border-blue-800/30">
            <SidebarLogo logoUrl={schoolLogoUrl} schoolName={schoolName} />
            <div className="flex-1">
              <h1 className="font-bold text-white text-sm">{schoolName}</h1>
              <p className="text-xs text-white/80">{schoolTagline}</p>
            </div>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-1 text-white hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {filteredNavigation.map((item) => {
              const active = isActive(item.href);
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = expandedItems.includes(item.title) || isChildActive(item.children);
              const hasActiveChild = isChildActive(item.children);

              return (
                <div key={`${item.href}-${item.title}`}>
                  {hasChildren ? (
                    <button
                      onClick={() => toggleExpand(item.title)}
                      className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                        hasActiveChild
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "text-white hover:bg-blue-800/50 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={hasActiveChild ? "text-yellow-400" : ""}>{item.icon}</span>
                        <span className="font-medium text-sm">{item.title}</span>
                      </div>
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                        active
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "text-white hover:bg-blue-800/50 hover:text-white"
                      }`}
                    >
                      <span className={active ? "text-yellow-400" : ""}>{item.icon}</span>
                      <span className="font-medium text-sm">{item.title}</span>
                    </Link>
                  )}

                  {hasChildren && isExpanded && (
                    <div className="mt-1 ml-4 pl-4 border-l border-blue-700/50 space-y-1">
                      {item.children?.map((child) => {
                        const childActive = pathname === child.href;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setIsMobileOpen(false)}
                            className={`block px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                              childActive
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "text-white/90 hover:bg-blue-800/50 hover:text-white"
                            }`}
                          >
                            {child.title}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-blue-800/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-blue-900">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{userName}</p>
                <p className="text-xs text-white/80 truncate">{userRole}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-800/50 hover:bg-red-600/80 text-white hover:text-white rounded-lg transition-colors text-sm font-medium"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-gradient-to-b from-blue-900 to-blue-950 min-h-screen">
        {/* Logo Section */}
        <div className="h-16 flex items-center gap-3 px-4 border-b border-blue-800/30">
          <SidebarLogo logoUrl={schoolLogoUrl} schoolName={schoolName} />
          <div className="flex-1">
            <h1 className="font-bold text-white text-sm">{schoolName}</h1>
            <p className="text-xs text-white/80">{schoolTagline}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {filteredNavigation.map((item) => {
            const active = isActive(item.href);
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedItems.includes(item.title) || isChildActive(item.children);
            const hasActiveChild = isChildActive(item.children);

            return (
              <div key={`${item.href}-${item.title}`}>
                {hasChildren ? (
                  <button
                    onClick={() => toggleExpand(item.title)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                      hasActiveChild
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "text-white hover:bg-blue-800/50 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={hasActiveChild ? "text-yellow-400" : ""}>{item.icon}</span>
                      <span className="font-medium text-sm">{item.title}</span>
                    </div>
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                      active
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "text-white hover:bg-blue-800/50 hover:text-white"
                    }`}
                  >
                    <span className={active ? "text-yellow-400" : ""}>{item.icon}</span>
                    <span className="font-medium text-sm">{item.title}</span>
                  </Link>
                )}

                {hasChildren && isExpanded && (
                  <div className="mt-1 ml-4 pl-4 border-l border-blue-700/50 space-y-1">
                    {item.children?.map((child) => {
                      const childActive = pathname === child.href;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                            childActive
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "text-white/90 hover:bg-blue-800/50 hover:text-white"
                          }`}
                        >
                          {child.title}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-blue-800/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-blue-900">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{userName}</p>
              <p className="text-xs text-white/80 truncate">{userRole}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-800/50 hover:bg-red-600/80 text-white hover:text-white rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
