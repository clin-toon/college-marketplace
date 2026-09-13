import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import type { CategoryCount } from "../../features/admin-listings/types/adminListing.types";

const PALETTE = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#14b8a6",
  "#f97316",
];

export default function ListingCategoryChart({
  data,
}: {
  data: CategoryCount[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="listingCount"
          nameKey="categoryName"
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          label={(props) => {
            const { categoryName, listingCount } = props as unknown as {
              categoryName: string;
              listingCount: number;
            };
            return `${categoryName}: ${listingCount}`;
          }}
          fontSize={11}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [value, "Listings"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
