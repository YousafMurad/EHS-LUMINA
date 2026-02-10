// Promotion History Page - View all past promotions
import { PageHeader } from "@/components/dashboard/page-header";
import { getPromotions } from "@/server/queries/promotions";
import { getSessions } from "@/server/queries/sessions";
import { getClasses } from "@/server/queries/classes";
import { PromotionHistoryTable } from "./promotion-history-table";

interface PromotionHistoryPageProps {
  searchParams: Promise<{
    session_id?: string;
    from_class_id?: string;
    page?: string;
  }>;
}

export default async function PromotionHistoryPage({ searchParams }: PromotionHistoryPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");

  const [promotionsData, sessions, classes] = await Promise.all([
    getPromotions({
      session_id: params.session_id,
      from_class_id: params.from_class_id,
      page,
      limit: 20,
    }),
    getSessions(),
    getClasses(true),
  ]);

  type ClassType = { id: string; name: string };
  type SessionType = { id: string; name: string };

  const classOptions = (classes as ClassType[]).map((cls) => ({
    id: cls.id,
    name: cls.name,
  }));

  const sessionOptions = (sessions as SessionType[]).map((s) => ({
    id: s.id,
    name: s.name,
  }));

  return (
    <div>
      <PageHeader
        title="Promotion History"
        description={`View all promotion records (${promotionsData.total} total)`}
        breadcrumbs={[
          { label: "Promotions", href: "/promotions" },
          { label: "History" },
        ]}
      />

      <PromotionHistoryTable
        promotions={promotionsData.promotions}
        total={promotionsData.total}
        page={promotionsData.page}
        totalPages={promotionsData.totalPages}
        classOptions={classOptions}
        sessionOptions={sessionOptions}
        currentFilters={{
          session_id: params.session_id || "",
          from_class_id: params.from_class_id || "",
        }}
      />
    </div>
  );
}
