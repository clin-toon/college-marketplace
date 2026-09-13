import {
  FaUsers,
  FaUserGraduate,
  FaCheckCircle,
  FaPenAlt,
  FaStore,
} from "react-icons/fa";

import type { UserStats, AccountOverview } from "../../utils/userStats";

function StatCard({
  icon: Icon,
  label,
  value,
  iconColor,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  iconColor: string;
}) {
  return (
    <div
      className="
        group relative overflow-hidden
        rounded-2xl
        border border-slate-200/80
        bg-white
        p-5
        transition-all duration-300
        hover:-translate-y-0.5
        hover:border-slate-300
        hover:shadow-[0_14px_35px_rgba(15,23,42,0.06)]
      "
    >
      {/* Very subtle accent glow */}
      <div
        className="
          pointer-events-none
          absolute -right-10 -top-10
          h-28 w-28
          rounded-full
          bg-slate-50
          opacity-80
          transition-transform duration-500
          group-hover:scale-125
        "
      />

      <div className="relative">
        {/* Icon + label */}
        <div className="flex items-center justify-between">
          <div
            className="
              flex h-10 w-10
              items-center justify-center
              rounded-xl
              bg-slate-50
              ring-1 ring-slate-100
              transition-colors duration-200
              group-hover:bg-slate-100
            "
          >
            <Icon className={`text-sm ${iconColor}`} aria-hidden="true" />
          </div>

          <span
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.14em]
              text-slate-300
            "
          >
            Users
          </span>
        </div>

        {/* Main value */}
        <div className="mt-7">
          <p
            className="
              text-[2.25rem]
              font-semibold
              leading-none
              tracking-[-0.045em]
              tabular-nums
              text-slate-950
            "
          >
            {value.toLocaleString()}
          </p>

          <p className="mt-2 text-sm font-medium text-slate-500">{label}</p>
        </div>

        {/* Bottom metadata */}
        <div className="mt-6 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-300 transition-colors group-hover:bg-slate-500" />

          <span className="text-[11px] font-medium text-slate-400">
            Current total
          </span>
        </div>
      </div>
    </div>
  );
}

export default function UserStatsSection({ stats }: { stats: UserStats }) {
  const cards = [
    {
      icon: FaUsers,
      label: "Total Users",
      value: stats.totalUsers,
      iconColor: "text-indigo-600",
    },
    {
      icon: FaUserGraduate,
      label: "Students",
      value: stats.students,
      iconColor: "text-slate-500",
    },
    {
      icon: FaCheckCircle,
      label: "Verified Users",
      value: stats.verified,
      iconColor: "text-emerald-600",
    },
    {
      icon: FaPenAlt,
      label: "Can Post",
      value: stats.canPost,
      iconColor: "text-blue-600",
    },
    {
      icon: FaStore,
      label: "Active Posters",
      value: stats.activePosters,
      iconColor: "text-amber-600",
    },
  ];

  return (
    <div
      className="
        grid grid-cols-1 gap-3
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-5
      "
    >
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}

export function AccountOverviewSection({
  overview,
}: {
  overview: AccountOverview;
}) {
  const rows: [string, number][] = [
    ["Verified", overview.verified],
    ["Unverified", overview.unverified],
    ["Allowed to post", overview.allowedToPost],
    ["Posting restricted", overview.postingRestricted],
    ["Users with listings", overview.withListings],
    ["Users without listings", overview.withoutListings],
  ];

  return (
    <section
      className="
        overflow-hidden
        rounded-2xl
        border border-slate-200/80
        bg-white
        shadow-[0_1px_2px_rgba(15,23,42,0.025)]
      "
    >
      {/* Header */}
      <div
        className="
          flex flex-col gap-3
          border-b border-slate-100
          px-5 py-5
          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:px-6
        "
      >
        <div>
          <div className="flex items-center gap-2.5">
            <div
              className="
                flex h-7 w-7
                items-center justify-center
                rounded-lg
                bg-slate-950
              "
            >
              <FaUsers className="text-[10px] text-white" aria-hidden="true" />
            </div>

            <h2
              className="
                text-sm
                font-semibold
                tracking-tight
                text-slate-900
              "
            >
              Account overview
            </h2>
          </div>

          <p className="mt-1.5 pl-9 text-xs text-slate-400">
            Verification and marketplace participation
          </p>
        </div>

        <span
          className="
            w-fit
            rounded-full
            border border-slate-200
            bg-slate-50
            px-3 py-1.5
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.12em]
            text-slate-400
          "
        >
          Account metrics
        </span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map(([label, value], index) => (
          <div
            key={label}
            className={`
              group relative
              flex items-center
              justify-between
              gap-4
              px-5 py-5
              transition-colors duration-200
              hover:bg-slate-50/70
              sm:px-6

              ${index < rows.length - 3 ? "border-b border-slate-100" : ""}

              ${
                index < rows.length - 1 ? "sm:border-b sm:border-slate-100" : ""
              }

              ${index % 3 !== 2 ? "lg:border-r lg:border-slate-100" : ""}
            `}
          >
            {/* Label */}
            <div className="min-w-0">
              <p
                className="
                  truncate
                  text-sm
                  font-medium
                  text-slate-600
                  transition-colors
                  group-hover:text-slate-900
                "
              >
                {label}
              </p>

              <p className="mt-1 text-[11px] text-slate-400">Account status</p>
            </div>

            {/* Value */}
            <span
              className="
                shrink-0
                text-xl
                font-semibold
                tracking-[-0.03em]
                tabular-nums
                text-slate-900
              "
            >
              {value.toLocaleString()}
            </span>

            {/* Hover indicator */}
            <div
              className="
                pointer-events-none
                absolute bottom-0 left-6 right-6
                h-px
                origin-left
                scale-x-0
                bg-slate-300
                transition-transform duration-300
                group-hover:scale-x-100
              "
            />
          </div>
        ))}
      </div>
    </section>
  );
}
