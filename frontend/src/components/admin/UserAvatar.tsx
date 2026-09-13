import { getInitials } from "../../utils/userFormat";

const PALETTES = [
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-purple-100 text-purple-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
];

/** Deterministic color per user, based on the UUID. */
export default function UserAvatar({
  name,
  userId,
  size = "md",
}: {
  name: string;
  userId: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-20 w-20 text-2xl",
  };
  const hash = [...userId].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const palette = PALETTES[hash % PALETTES.length];

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${sizes[size]} ${palette}`}
      aria-hidden
    >
      {getInitials(name)}
    </div>
  );
}
