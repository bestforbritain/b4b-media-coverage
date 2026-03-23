export function StatCard({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: number | string;
  sublabel?: string;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="text-sm font-medium text-gray-500">{label}</div>
      <div className="mt-1 text-3xl font-bold text-bfb-blue">{value}</div>
      {sublabel && (
        <div className="mt-1 text-xs text-gray-400">{sublabel}</div>
      )}
    </div>
  );
}
