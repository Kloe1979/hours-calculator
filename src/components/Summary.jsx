import ResultCard from "./ResultCard";

export default function Summary({
  maxHours,
  minHours,
  atLeastHours,
  targetMeetingContactHours,
  targetMeetingClockHours,
}) {
  const targetSummary = [
    `Maximum total contact hours: ${maxHours}.`,
    `Schedule at least ${atLeastHours}.`,
    `Minimum total contact hours: ${minHours}.`,
    `Estimated target meeting contact hours: ${targetMeetingContactHours.toFixed(1)}.`,
    `Target meeting clock hours: ${targetMeetingClockHours}.`,
  ].join(" ");

  return (
    <>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {targetSummary}
      </p>
      <div className="mt-3 grid justify-center gap-2 [grid-template-columns:repeat(auto-fit,minmax(150px,180px))]">
        <ResultCard
          title="Max Total Contact Hours"
          value={maxHours}
          color="info"
        />
        <ResultCard
          title="Schedule at Least"
          value={atLeastHours}
          color="info"
        />
        <ResultCard
          title="Min Total Contact Hours"
          value={minHours}
          color="info"
        />
        <ResultCard
          title="Target Meeting Contact Hours (estimate)"
          value={targetMeetingContactHours.toFixed(1)}
          color="info"
        />
        <ResultCard
          title="Target Meeting Clock Hours"
          value={targetMeetingClockHours}
          color="info"
        />
      </div>
    </>
  );
}
