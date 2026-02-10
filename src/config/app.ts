// App Configuration
export const APP_CONFIG = {
  name: "Eastern High School ERP",
  shortName: "EHS ERP",
  description: "Student and Fee Management System for Eastern High School",
  school: {
    name: "Eastern High School",
    abbreviation: "EHS",
    city: "Faisalabad",
    motto: "Fight Against Ignorance",
    phone: "+92-XXX-XXXXXXX",
    email: "info@easternhighschool.pk",
    address: "Faisalabad, Pakistan",
    website: "https://easternhighschool.pk",
  },
  branding: {
    primary: "#4B0082",
    primaryLight: "#6B238E",
    primaryDark: "#3C006A",
    accent: "#C4A962",
    accentLight: "#D4BE82",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
  },
  defaults: {
    pagination: {
      limit: 10,
      options: [10, 25, 50, 100],
    },
    currency: "PKR",
    locale: "en-PK",
    dateFormat: "DD-MM-YYYY",
    timeFormat: "hh:mm A",
  },
  features: {
    familyTree: true,
    certificates: true,
    bulkPromotion: true,
    memoFees: true,
    boardFees: true,
  },
} as const;

export type AppConfig = typeof APP_CONFIG;
