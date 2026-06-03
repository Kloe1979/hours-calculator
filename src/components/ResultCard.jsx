export default function ResultCard({ title, value, color = "" }) {
  const colorClasses = {
    success: "border-l-green-600",
    warning: "border-l-amber-600",
    info: "border-l-blue-600",
  };

  return (
    <div
      className={`flex min-h-[110px] flex-col items-center justify-center rounded-[14px] border border-gray-300 border-l-[6px] bg-gray-50 p-5 text-center ${
        colorClasses[color] ?? "border-l-transparent"
      }`}
    >
      <span className="block text-sm text-gray-600">{title}</span>
      <strong className="mt-2 block text-base font-bold">{value}</strong>
    </div>
  );
}
