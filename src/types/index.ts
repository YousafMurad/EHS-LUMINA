// Types barrel export
export type { Database, Json } from "./database";

export type {
  Student,
  StudentInsert,
  StudentUpdate,
  StudentWithRelations,
  StudentStatus,
  Gender,
  BloodGroup,
  FamilyMember,
  PromotionRecord,
  StudentFormData,
} from "./student";

export type {
  FeeStructure,
  FeeStructureInsert,
  StudentFee,
  Payment,
  StudentDiscount,
  FeeStatus,
  PaymentMethod,
  FeeStructureWithRelations,
  StudentFeeWithRelations,
  FeeBreakdown,
  PaymentFormData,
  FeeStructureFormData,
  FeeSummary,
} from "./fee";

export type {
  Class,
  ClassInsert,
  ClassUpdate,
  Section,
  SectionInsert,
  SectionUpdate,
  ClassWithRelations,
  SectionWithRelations,
  ClassFormData,
  SectionFormData,
  ClassOption,
  SectionOption,
} from "./class";

export type {
  Teacher,
  TeacherInsert,
  TeacherUpdate,
  SalaryHistory,
  ContractType,
  TeacherWithRelations,
  TeacherFormData,
  TeacherOption,
  TeacherStats,
} from "./teacher";

export type {
  Profile,
  ProfileInsert,
  ProfileUpdate,
  Role,
  UserWithProfile,
  Operator,
  OperatorFormData,
  SessionUser,
  AuthState,
} from "./user";

export type {
  Session,
  SessionInsert,
  SessionUpdate,
  SessionFormData,
  SessionOption,
  AcademicYear,
} from "./session";

export type {
  PaginatedResult,
  ActionResult,
  SelectOption,
  TableColumn,
  FilterOption,
  BreadcrumbItem,
  Activity,
  DashboardStats,
  ChartData,
} from "./common";
