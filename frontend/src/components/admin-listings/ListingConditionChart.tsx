import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { ConditionCount } from "../../features/admin-listings/types/adminListing.types";

import {
  CONDITION_COLORS,
  formatCondition,
} from "../../features/admin-listings/utils/listingFormat";

export default function ListingConditionChart({
  data,
}: {
  data: ConditionCount[];
}) {
  const chartData = data.map((d) => ({
    name: formatCondition(d.condition),
    count: d.listingCount,
    fill: CONDITION_COLORS[d.condition] ?? "#94a3b8",
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={chartData}
        margin={{ top: 4, right: 8, bottom: 0, left: -18 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
        <Tooltip formatter={(value) => [value, "Listings"]} />
        <Bar dataKey="count" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
