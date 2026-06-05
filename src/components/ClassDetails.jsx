export default function ClassDetails({
  catalogHours,
  setCatalogHours,
  instructionalWeeks,
  setInstructionalWeeks,
  meetingsPerWeek,
  setMeetingsPerWeek,
}) {
  const inputClass =
    "w-full rounded-md border border-gray-300 px-2.5 py-2 text-base text-center font-normal";

  return (
    <>
      <h2 className="mt-6 mb-2 text-center text-xl font-bold">Class Targets</h2>
      <div className="border-t border-gray-300" />

      <div className="mt-2 grid gap-4 md:grid-cols-3">
        <label className="grid gap-2 text-center font-bold">
          <span>Catalog Hours</span>
          <input
            className={inputClass}
            type="number"
            value={catalogHours}
            onChange={(event) => setCatalogHours(event.target.value)}
          />
        </label>
        <label className="grid gap-2 text-center font-bold">
          <span>Instructional Weeks</span>
          <input
            className={inputClass}
            type="number"
            value={instructionalWeeks}
            onChange={(event) => setInstructionalWeeks(event.target.value)}
          />
        </label>
        <label className="grid gap-2 text-center font-bold">
          <span>Meetings Per Week</span>
          <input
            className={inputClass}
            type="number"
            value={meetingsPerWeek}
            onChange={(event) => setMeetingsPerWeek(event.target.value)}
          />
        </label>
      </div>
    </>
  );
}
