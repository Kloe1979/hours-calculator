import ResultCard from "./ResultCard";
import { tableClasses } from "../lib/componentStyles";

export default function MeetingTable({
  meetingRows,
  updateMeetingRow,
  normalizeMeetingRowTime,
  deleteMeetingRow,
  addMeetingRow,
  calculateMeetingRow,
  courseStatus,
  courseStatusColor,
  totalScheduledContactHours,
  round2,
}) {
  const calculatedMeetingRows = meetingRows.map(calculateMeetingRow);
  const validationMessages = calculatedMeetingRows.flatMap(
    ({ totalClockMinutes, clockHours, partialClockMinutes }, index) =>
      [
        totalClockMinutes > 0 &&
          totalClockMinutes < 50 &&
          `Meeting ${index + 1} must be at least 50 minutes`,
        clockHours > 0 &&
          partialClockMinutes === 0 &&
          `Meeting ${index + 1} cannot be scheduled in 60-minute increments`,
        [40, 45, 55].includes(partialClockMinutes) &&
          `Meeting ${index + 1} cannot have 40, 45, or 55 partial minutes`,
      ]
        .filter(Boolean)
        .map((message) => ({ rowIndex: index, message })),
  );

  return (
    <>
      <h2 className="mt-0 mb-2 text-center text-xl font-bold">
        Meeting Patterns to Contact Hours
      </h2>
      <p id="meeting-time-format-help" className="mb-2 text-sm text-gray-600">
        Enter times using a 24-hour clock, such as 09:30 or 1430. Times round to
        the nearest five minutes.
      </p>
      <div className="overflow-x-auto">
        <table className="mt-2 w-full table-auto border-collapse">
          <caption className="sr-only">
            Meeting patterns and calculated contact hours
          </caption>
          <thead>
            <tr>
              <th className={tableClasses.header} scope="col">
                Start Time
              </th>
              <th className={tableClasses.header} scope="col">
                End Time
              </th>
              <th className={tableClasses.header} scope="col">
                Clock Hours
              </th>
              <th className={tableClasses.header} scope="col">
                Clock Minutes
              </th>
              <th className={tableClasses.header} scope="col">
                Total Clock Minutes
              </th>
              <th className={tableClasses.header} scope="col">
                Meeting Contact Hours
              </th>
              <th className={tableClasses.header} scope="col">
                Number of Meetings
              </th>
              <th className={tableClasses.header} scope="col">
                Total Contact Hours
              </th>
              <th className={tableClasses.header} scope="col">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {meetingRows.map((row, index) => {
              const {
                totalClockMinutes,
                clockHours,
                partialClockMinutes,
                contactHours,
                totalContactHours,
              } = calculatedMeetingRows[index];
              const rowHasError = validationMessages.some(
                ({ rowIndex }) => rowIndex === index,
              );
              const validationDescription = rowHasError
                ? "meeting-time-format-help meeting-validation-messages"
                : "meeting-time-format-help";

              return (
                <tr key={index}>
                  <td className={tableClasses.cell}>
                    <input
                      className={tableClasses.input}
                      type="text"
                      inputMode="numeric"
                      placeholder="HH:MM"
                      aria-label={`Start time, meeting ${index + 1}`}
                      aria-describedby={validationDescription}
                      aria-invalid={rowHasError}
                      value={row.startTime}
                      onChange={(event) =>
                        updateMeetingRow(index, "startTime", event.target.value)
                      }
                      onBlur={() => normalizeMeetingRowTime(index, "startTime")}
                    />
                  </td>

                  <td className={tableClasses.cell}>
                    <input
                      className={tableClasses.input}
                      type="text"
                      inputMode="numeric"
                      placeholder="HH:MM"
                      aria-label={`End time, meeting ${index + 1}`}
                      aria-describedby={validationDescription}
                      aria-invalid={rowHasError}
                      value={row.endTime}
                      onChange={(event) =>
                        updateMeetingRow(index, "endTime", event.target.value)
                      }
                      onBlur={() => normalizeMeetingRowTime(index, "endTime")}
                    />
                  </td>

                  <td className={tableClasses.cell}>{clockHours}</td>
                  <td className={tableClasses.cell}>{partialClockMinutes}</td>
                  <td className={tableClasses.cell}>{totalClockMinutes}</td>
                  <td className={tableClasses.cell}>{contactHours ?? ""}</td>

                  <td className={tableClasses.cell}>
                    <input
                      className={tableClasses.input}
                      type="number"
                      min={0}
                      aria-label={`Number of meetings, meeting pattern ${index + 1}`}
                      value={row.totalMeetings}
                      onChange={(event) =>
                        updateMeetingRow(
                          index,
                          "totalMeetings",
                          event.target.value,
                        )
                      }
                    />
                  </td>

                  <td className={tableClasses.cell}>{totalContactHours}</td>

                  <td className={tableClasses.cell}>
                    <button
                      className={tableClasses.actionButton}
                      type="button"
                      aria-label={`Delete meeting ${index + 1}`}
                      onClick={() => deleteMeetingRow(index)}
                      disabled={meetingRows.length === 1}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-2 grid justify-end gap-2 [grid-template-columns:repeat(auto-fit,minmax(200px,210px))]">
        <ResultCard
          title="The hours total is"
          value={courseStatus}
          color={courseStatusColor}
        />
        <ResultCard
          title="Total"
          value={round2(totalScheduledContactHours)}
          color="success"
        />
        <button
          className={tableClasses.addButton}
          type="button"
          onClick={addMeetingRow}
        >
          Add Meeting
        </button>
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        Course status: {courseStatus}. Total scheduled contact hours:{" "}
        {round2(totalScheduledContactHours)}.
      </p>

      {validationMessages.length > 0 && (
        <div
          id="meeting-validation-messages"
          className="mt-3 text-left font-bold italic text-[#780606]"
          role="alert"
        >
          {validationMessages.map(({ rowIndex, message }) => (
            <p className="my-1" key={`${rowIndex}-${message}`}>
              {message}
            </p>
          ))}
        </div>
      )}
    </>
  );
}
