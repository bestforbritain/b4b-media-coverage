import { getOutletArticles } from "@/lib/data";
import { OutletTable } from "./OutletTable";

export const metadata = {
  title: "Outlet Breakdown — Best for Britain",
};

export default function OutletsPage() {
  const outlets = getOutletArticles();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Outlet Breakdown
      </h1>
      <p className="text-gray-500 mb-6">
        All media outlets that have covered Best for Britain and associated
        entities, ranked by total coverage.
      </p>

      <OutletTable outlets={outlets} />
    </div>
  );
}
