import { classDetailInputClass } from "../lib/componentStyles";

export default function ClassDetails({
  catalogHours,
  setCatalogHours,
  numberOfMeetings,
  setNumberOfMeetings,
  showMinimumMeetingContactHoursMessage,
}) {
  return (
    <>
      <h2 className="mt-6 mb-2 text-center text-xl font-bold">Class Targets</h2>
      <div className="border-t border-gray-300" />

      <div className="mt-2 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-center font-bold">
          <span>Catalog Hours</span>
          <input
            className={classDetailInputClass}
            type="number"
            min={0}
            value={catalogHours}
            onChange={(event) => setCatalogHours(event.target.value)}
          />
        </label>
        <label className="grid gap-2 text-center font-bold">
          <span>Number of Meetings</span>
          <input
            className={classDetailInputClass}
            type="number"
            min={0}
            value={numberOfMeetings}
            onChange={(event) => setNumberOfMeetings(event.target.value)}
          />
        </label>
      </div>

      {showMinimumMeetingContactHoursMessage && (
        <div
          className="mt-3 text-right font-bold italic text-[#780606]"
          role="alert"
        >
          <p className="my-1">
            Meetings must be at least one (1) contact hour.
          </p>
        </div>
      )}
    </>
  );
}
