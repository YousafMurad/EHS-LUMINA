// Navigation Configuration
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
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "./routes";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  permission?: string;
  children?: NavItem[];
}

export const MAIN_NAV: NavItem[] = [
  {
    title: "Dashboard",
    href: ROUTES.dashboard.root,
    icon: LayoutDashboard,
  },
  {
    title: "Students",
    href: ROUTES.students.list,
    icon: Users,
    permission: "students:read",
    children: [
      { title: "All Students", href: ROUTES.students.list, icon: Users },
      { title: "Add Student", href: ROUTES.students.new, icon: Users, permission: "students:create" },
      { title: "Old Students", href: ROUTES.students.old, icon: Users },
    ],
  },
  {
    title: "Classes",
    href: ROUTES.classes.list,
    icon: GraduationCap,
    permission: "classes:read",
    children: [
      { title: "All Classes", href: ROUTES.classes.list, icon: GraduationCap },
      { title: "Add Class", href: ROUTES.classes.new, icon: GraduationCap, permission: "classes:create" },
    ],
  },
  {
    title: "Sections",
    href: ROUTES.sections.list,
    icon: BookOpen,
    permission: "sections:read",
    children: [
      { title: "All Sections", href: ROUTES.sections.list, icon: BookOpen },
      { title: "Add Section", href: ROUTES.sections.new, icon: BookOpen, permission: "sections:create" },
    ],
  },
  {
    title: "Teachers",
    href: ROUTES.teachers.list,
    icon: GraduationCap,
    permission: "teachers:read",
    children: [
      { title: "All Teachers", href: ROUTES.teachers.list, icon: GraduationCap },
      { title: "Add Teacher", href: ROUTES.teachers.new, icon: GraduationCap, permission: "teachers:create" },
      { title: "Class Assignments", href: "/teachers/assignments", icon: GraduationCap, permission: "teachers:edit" },
    ],
  },
  {
    title: "Operators",
    href: ROUTES.operators.list,
    icon: UserCog,
    permission: "operators:read",
    children: [
      { title: "All Operators", href: ROUTES.operators.list, icon: UserCog },
      { title: "Add Operator", href: ROUTES.operators.new, icon: UserCog, permission: "operators:create" },
    ],
  },
  {
    title: "Fees",
    href: ROUTES.fees.overview,
    icon: DollarSign,
    permission: "fees:read",
    children: [
      { title: "Overview", href: ROUTES.fees.overview, icon: DollarSign },
      { title: "Fee Structures", href: ROUTES.fees.structures, icon: DollarSign, permission: "fees:manage" },
      { title: "Collection", href: ROUTES.fees.collection, icon: DollarSign, permission: "fees:collect" },
      { title: "Due Fees", href: ROUTES.fees.dues, icon: DollarSign },
      { title: "Discounts", href: ROUTES.fees.discounts, icon: DollarSign, permission: "fees:manage" },
      { title: "Fines", href: ROUTES.fees.fines, icon: DollarSign },
      { title: "Memo Fees", href: ROUTES.fees.memo, icon: DollarSign },
      { title: "History", href: ROUTES.fees.history, icon: DollarSign },
    ],
  },
  {
    title: "Promotions",
    href: ROUTES.promotions.list,
    icon: ArrowUpDown,
    permission: "promotions:read",
    children: [
      { title: "All Promotions", href: ROUTES.promotions.list, icon: ArrowUpDown },
      { title: "Bulk Promotion", href: ROUTES.promotions.bulk, icon: ArrowUpDown, permission: "promotions:create" },
      { title: "History", href: ROUTES.promotions.history, icon: ArrowUpDown },
    ],
  },
  {
    title: "Sessions",
    href: ROUTES.sessions.list,
    icon: Calendar,
    permission: "sessions:read",
    children: [
      { title: "All Sessions", href: ROUTES.sessions.list, icon: Calendar },
      { title: "Add Session", href: ROUTES.sessions.new, icon: Calendar, permission: "sessions:create" },
    ],
  },
  {
    title: "Reports",
    href: ROUTES.reports.overview,
    icon: FileText,
    permission: "reports:read",
    children: [
      { title: "Overview", href: ROUTES.reports.overview, icon: FileText },
      { title: "Fee Reports", href: ROUTES.reports.fees, icon: FileText },
      { title: "Student Reports", href: ROUTES.reports.students, icon: FileText },
      { title: "Attendance", href: ROUTES.reports.attendance, icon: FileText },
      { title: "Financial", href: ROUTES.reports.financial, icon: FileText },
    ],
  },
  {
    title: "Certificates",
    href: ROUTES.certificates.overview,
    icon: Award,
    permission: "certificates:read",
    children: [
      { title: "Overview", href: ROUTES.certificates.overview, icon: Award },
      { title: "SLC", href: ROUTES.certificates.slc, icon: Award },
      { title: "Character", href: ROUTES.certificates.character, icon: Award },
      { title: "Result Card", href: ROUTES.certificates.resultCard, icon: Award },
    ],
  },
  {
    title: "Settings",
    href: ROUTES.settings.overview,
    icon: Settings,
    permission: "settings:read",
    children: [
      { title: "Overview", href: ROUTES.settings.overview, icon: Settings },
      { title: "General", href: ROUTES.settings.general, icon: Settings },
      { title: "Roles & Permissions", href: ROUTES.settings.roles, icon: Settings, permission: "settings:roles" },
      { title: "Fee Settings", href: ROUTES.settings.fees, icon: Settings, permission: "settings:fees" },
      { title: "Policies", href: ROUTES.settings.policies, icon: Settings },
      { title: "Audit Logs", href: ROUTES.settings.auditLogs, icon: Settings, permission: "settings:audit" },
    ],
  },
];
