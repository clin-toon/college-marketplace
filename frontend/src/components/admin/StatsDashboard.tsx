import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  FaUsers,
  FaStore,
  FaCheckCircle,
  FaTags,
  FaComments,
  FaHeart,
  FaArrowUp,
} from "react-icons/fa";

import type { AdminStats } from "@/features/admin/types/admin.types";

const STATUS_COLORS = ["#10b981", "#3b82f6", "#ef4444"];

type StatCardProps = {
  label: string;
  value: number;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  positive?: boolean;
};

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  iconBg,
  iconColor,
  positive = false,
}: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* Decorative background */}
      <div
        className={`absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-40 ${iconBg}`}
      />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value.toLocaleString()}
          </p>

          <div className="mt-2 flex items-center gap-1.5 text-xs">
            {positive && (
              <span className="flex items-center gap-1 font-semibold text-emerald-600">
                <FaArrowUp className="text-[9px]" />
                {sub}
              </span>
            )}

            {!positive && <span className="text-slate-400">{sub}</span>}
          </div>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
        >
          <Icon className={`text-lg ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}

function ChartCard({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm ${className}`}
    >
      <div className="mb-5">
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>

        {description && (
          <p className="mt-1 text-xs text-slate-400">{description}</p>
        )}
      </div>

      {children}
    </div>
  );
}

// Pure presentational component.
// Receives already-fetched statistics through props.
export default function StatsDashboard({ data }: { data: AdminStats }) {
  const listingStatusData = [
    {
      name: "Active",
      value: data.activeListings,
    },
    {
      name: "Sold",
      value: data.soldListings,
    },
    {
      name: "Removed",
      value: data.removedListings,
    },
  ];

  const weeklyActivityData = [
    {
      name: "Users",
      count: data.newUsersThisWeek,
    },
    {
      name: "Listings",
      count: data.newListingsThisWeek,
    },
  ];

  const engagementData = [
    {
      name: "Messages",
      value: data.totalMessages,
    },
    {
      name: "Favourites",
      value: data.totalFavourites,
    },
  ];

  const totalStatusListings =
    data.activeListings + data.soldListings + data.removedListings;

  const statCards: StatCardProps[] = [
    {
      label: "Total Users",
      value: data.totalUsers,
      sub: `+${data.newUsersThisWeek} this week`,
      icon: FaUsers,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      positive: data.newUsersThisWeek > 0,
    },
    {
      label: "Total Listings",
      value: data.totalListings,
      sub: `+${data.newListingsThisWeek} this week`,
      icon: FaStore,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      positive: data.newListingsThisWeek > 0,
    },
    {
      label: "Active Listings",
      value: data.activeListings,
      sub: "Currently live",
      icon: FaCheckCircle,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      label: "Categories",
      value: data.totalCategories,
      sub: "Available categories",
      icon: FaTags,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      label: "Messages",
      value: data.totalMessages,
      sub: "Total conversations",
      icon: FaComments,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      label: "Favourites",
      value: data.totalFavourites,
      sub: "Saved listings",
      icon: FaHeart,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Marketplace Overview
        </h1>

        <p className="text-sm text-slate-500">
          Monitor users, listings and marketplace activity.
        </p>
      </div>

      {/* =====================================================
          KPI CARDS
      ====================================================== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* =====================================================
          MAIN ANALYTICS
      ====================================================== */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* -----------------------------------------------------
            LISTING STATUS
        ------------------------------------------------------ */}
        <ChartCard
          title="Listing Status"
          description="Current marketplace inventory"
          className="xl:col-span-1"
        >
          <div className="relative h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={listingStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                  stroke="none"
                >
                  {listingStatusData.map((_, index) => (
                    <Cell key={`status-${index}`} fill={STATUS_COLORS[index]} />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
                  }}
                />

                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value) => (
                    <span className="text-xs text-slate-600">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Donut center */}
            <div className="pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-2xl font-bold text-slate-900">
                {totalStatusListings.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400">Listings</p>
            </div>
          </div>
        </ChartCard>

        {/* -----------------------------------------------------
            WEEKLY ACTIVITY
        ------------------------------------------------------ */}
        <ChartCard
          title="Weekly Activity"
          description="New users and listings this week"
          className="xl:col-span-2"
        >
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weeklyActivityData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 0,
                }}
                barCategoryGap="35%"
              >
                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke="#e2e8f0"
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: "#64748b",
                  }}
                />

                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 11,
                    fill: "#94a3b8",
                  }}
                />

                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
                  }}
                />

                <Bar
                  dataKey="count"
                  fill="#4f46e5"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={70}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* =====================================================
          ENGAGEMENT SECTION
      ====================================================== */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Engagement chart */}
        <ChartCard
          title="User Engagement"
          description="Messages and favourite activity"
        >
          <div className="h-[270px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={engagementData}
                layout="vertical"
                margin={{
                  top: 10,
                  right: 20,
                  left: 10,
                  bottom: 10,
                }}
              >
                <CartesianGrid
                  strokeDasharray="4 4"
                  horizontal={false}
                  stroke="#e2e8f0"
                />

                <XAxis
                  type="number"
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 11,
                    fill: "#94a3b8",
                  }}
                />

                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  width={75}
                  tick={{
                    fontSize: 12,
                    fill: "#475569",
                  }}
                />

                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
                  }}
                />

                <Bar
                  dataKey="value"
                  fill="#8b5cf6"
                  radius={[0, 8, 8, 0]}
                  maxBarSize={38}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Marketplace summary */}
        <ChartCard
          title="Marketplace Summary"
          description="Quick overview of your platform"
        >
          <div className="space-y-4">
            {/* Active */}
            <div className="flex items-center justify-between rounded-xl bg-emerald-50/70 px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                  <FaCheckCircle className="text-emerald-600" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Active Listings
                  </p>
                  <p className="text-xs text-slate-500">Currently available</p>
                </div>
              </div>

              <p className="text-xl font-bold text-emerald-600">
                {data.activeListings.toLocaleString()}
              </p>
            </div>

            {/* Sold */}
            <div className="flex items-center justify-between rounded-xl bg-blue-50/70 px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <FaStore className="text-blue-600" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Sold Listings
                  </p>
                  <p className="text-xs text-slate-500">Successfully sold</p>
                </div>
              </div>

              <p className="text-xl font-bold text-blue-600">
                {data.soldListings.toLocaleString()}
              </p>
            </div>

            {/* Removed */}
            <div className="flex items-center justify-between rounded-xl bg-rose-50/70 px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100">
                  <FaStore className="text-rose-600" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Removed Listings
                  </p>
                  <p className="text-xs text-slate-500">No longer available</p>
                </div>
              </div>

              <p className="text-xl font-bold text-rose-600">
                {data.removedListings.toLocaleString()}
              </p>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
