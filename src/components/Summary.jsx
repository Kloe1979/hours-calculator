import ResultCard from "./ResultCard";

export default function Summary({
  maxHours,
  minHours,
  atLeastHours,
  targetWeeklyContactHours,
  estimatedMeetingContactHours,
}) {
  return (
    <>
      <div className="mt-3 grid justify-center gap-2 [grid-template-columns:repeat(auto-fit,minmax(150px,180px))]">
        <ResultCard title="Max Total Contact Hours" value={maxHours} color="info"/>
        <ResultCard title="Min Total Contact Hours" value={minHours} color="info"/>
        <ResultCard title="Schedule at Least" value={atLeastHours} color="info"/>
        <ResultCard
          title="Target Weekly Contact Hours (estimate)"
          value={targetWeeklyContactHours.toFixed(1)}
          color="info"
        />
        <ResultCard
          title="Target Meeting Contact Hours (estimate)"
          value={estimatedMeetingContactHours.toFixed(1)}
          color="info"
        />
      </div>
    </>
  );
}
