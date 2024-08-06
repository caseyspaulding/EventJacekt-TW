import dashboard from "@/data/dashboard.json";
import type { Dashboard } from "@/types/dashboard";
import DashboardPageContent from "./content";

export interface DashboardPageData {
  dashboard: Dashboard;
}

async function getData (): Promise<DashboardPageData>
{
  return { dashboard };
}

export default async function UsersListPage() {
  const data = await getData();
  return <DashboardPageContent { ...data } />;
}
