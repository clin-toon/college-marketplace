import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { TimelinePoint } from "../../features/admin-listings/types/adminListing.types";

function formatTick(date: string): string {
  const d = new Date(date);
  return Number.isNaN(+d)
    ? date
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function ListingTimelineChart({
  data,
}: {
  data: TimelinePoint[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart
        data={data}
        margin={{ top: 4, right: 8, bottom: 0, left: -18 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="date"
          tickFormatter={formatTick}
          tick={{ fontSize: 11 }}
        />
        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
        <Tooltip
          labelFormatter={(label) => formatTick(String(label))}
          formatter={(value) => [value, "Listings"]}
        />
        <Line
          type="monotone"
          dataKey="listingCount"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
