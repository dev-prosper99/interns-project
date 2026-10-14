interface PillProps {
      label: string;
      color: string;
}

const CATEGORY_COLORS: Record<string, string> = {
      business: "#2563EB",
      sports: "#DC2626",
      art: "#9333EA",
      entertainment: "#EAB308",
      food: "#F97316",
      education: "#16A34A",
      others: "#64748B",
};

// Solid text over a ~24%-opacity tint of the same color
export default function Pill({ label, color }: PillProps) {
      return (
            <span
                  className="inline-flex  items-center rounded-full text-xs font-medium w-fit"
                  style={{
                        color,
                        backgroundColor: `${color}3D`,
                        paddingTop: 3,
                        paddingBottom: 3,
                        paddingLeft: 8,
                        paddingRight: 8,
                  }}
            >
                  {label}
            </span>
      );
}

export function CategoryPill({ label }: { label: string }) {
      const normalizedLabel = label.trim().toLowerCase();
      const category = normalizedLabel === "other" ? "others" : normalizedLabel;
      const color = CATEGORY_COLORS[category] ?? CATEGORY_COLORS.others;
      const textColor = ["entertainment", "food", "education"].includes(category) ? "#111827" : "#FFFFFF";

      return (
            <span className="inline-flex w-fit items-center rounded-full px-2 py-1 text-xs font-semibold" style={{ color: textColor, backgroundColor: color }}>
                  {label || "Others"}
            </span>
      );
}
