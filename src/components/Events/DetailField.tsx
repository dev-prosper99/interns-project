interface DetailFieldProps {
  label: string;
  value: string;
}

export default function DetailField({ label, value }: DetailFieldProps) {
  return (
    <div className="flex flex-col gap-1 flex-1">
      <p className="text-neutral-500 text-xs">{label}</p>
      <p className="text-white text-base font-medium">{value}</p>
    </div>
  );
}
