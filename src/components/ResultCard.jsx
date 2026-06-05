export default function ResultCard({ title, value, color = "" }) {
  const colorClasses = {
    success: "border-l-[#96D294]",
    warning: "border-l-[#C76A6B]",
    info: "border-l-[#6E99BE]",
  };

  return (
    <div
      className={`flex min-h-[50px] flex-col items-center justify-center rounded-[7px] border border-gray-300 border-l-[3px] bg-gray-50 p-1 text-center ${
        colorClasses[color] ?? "border-l-transparent"
      }`}
    >
      <span className="block text-sm text-gray-600">{title}</span>
      <strong className="mt-0.5 block text-md font-bold">{value}</strong>
    </div>
  );
}
