interface PillProps {
  label: string;
  color: string;
}

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
