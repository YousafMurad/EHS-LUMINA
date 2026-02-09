// Recent Activity Component for Dashboard
import { formatDistanceToNow } from "date-fns";
import {
  UserPlus,
  DollarSign,
  GraduationCap,
  AlertCircle,
  CheckCircle,
  Clock,
  LucideIcon,
} from "lucide-react";

interface Activity {
  id: string;
  type: "student_added" | "fee_paid" | "fee_pending" | "class_created" | "promotion";
  title: string;
  description: string;
  timestamp: Date;
  user?: string;
}

interface RecentActivityProps {
  activities?: Activity[];
}

const activityConfig: Record<
  Activity["type"],
  { icon: LucideIcon; color: string; bgColor: string }
> = {
  student_added: {
    icon: UserPlus,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  fee_paid: {
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  fee_pending: {
    icon: Clock,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  class_created: {
    icon: GraduationCap,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  promotion: {
    icon: GraduationCap,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
  },
};

// Mock data - will be replaced with real data
const mockActivities: Activity[] = [
  {
    id: "1",
    type: "fee_paid",
    title: "Fee Payment Received",
    description: "Ahmad Khan (Class 5A) - Rs. 5,000",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    user: "Operator 1",
  },
  {
    id: "2",
    type: "student_added",
    title: "New Student Registered",
    description: "Maria Bibi enrolled in Class 3B",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    user: "Admin",
  },
  {
    id: "3",
    type: "fee_pending",
    title: "Fee Reminder Sent",
    description: "15 students with pending fees for January",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: "4",
    type: "class_created",
    title: "New Section Created",
    description: "Class 6 - Section C added",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    user: "Admin",
  },
  {
    id: "5",
    type: "fee_paid",
    title: "Fee Payment Received",
    description: "Hassan Ali (Class 8A) - Rs. 7,500",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    user: "Operator 2",
  },
];

export function RecentActivity({ activities = mockActivities }: RecentActivityProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => {
          const config = activityConfig[activity.type];
          const Icon = config.icon;

          return (
            <div key={activity.id} className="flex items-start gap-4">
              <div className={`p-2 rounded-lg ${config.bgColor}`}>
                <Icon size={18} className={config.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-500 truncate">{activity.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-400">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </span>
                  {activity.user && (
                    <>
                      <span className="text-xs text-gray-300">•</span>
                      <span className="text-xs text-gray-400">by {activity.user}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
