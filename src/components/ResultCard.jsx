export default function ResultCard({ title, value, color = "" }) {
  return (
    <div className={`result-card ${color}`}>
      <span>{title}</span>
      <strong>{value}</strong>
    </div>
  );
}