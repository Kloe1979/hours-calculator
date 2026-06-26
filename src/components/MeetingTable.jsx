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
  const validationMessages = [
    calculatedMeetingRows.some(
      ({ totalClockMinutes }) => totalClockMinutes > 0 && totalClockMinutes < 50,
    ) && "Meetings must be at least 50 minutes",
    calculatedMeetingRows.some(
      ({ clockHours, partialClockMinutes }) =>
        clockHours > 0 && partialClockMinutes === 0,
    ) && "Meetings cannot be scheduled in 60-minute increments",
    calculatedMeetingRows.some(({ partialClockMinutes }) =>
      [40, 45, 55].includes(partialClockMinutes),
    ) && "Partial meeting hours cannot be 40, 45, or 55 minutes",
  ].filter(Boolean);

  return (
    <>
      <h2 className="mt-0 mb-2 text-center text-xl font-bold">
        Meeting Patterns to Contact Hours
      </h2>
      <div className="overflow-x-auto">
        <table className="mt-2 w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className={tableClasses.header}>Start Time</th>
              <th className={tableClasses.header}>End Time</th>
              <th className={tableClasses.header}>Clock Hours</th>
              <th className={tableClasses.header}>Clock Minutes</th>
              <th className={tableClasses.header}>Total Clock Minutes</th>
              <th className={tableClasses.header}>Meeting Contact Hours</th>
              <th className={tableClasses.header}>Number of Meetings</th>
              <th className={tableClasses.header}>Total Contact Hours</th>
              <th className={tableClasses.header}>Actions</th>
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

              return (
                <tr key={index}>
                  <td className={tableClasses.cell}>
                    <input
                      className={tableClasses.input}
                      type="text"
                      inputMode="numeric"
                      placeholder="HH:MM"
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

      {validationMessages.length > 0 && (
        <div className="mt-3 text-left font-bold italic text-[#780606]">
          {validationMessages.map((message) => (
            <p className="my-1" key={message}>
              {message}
            </p>
          ))}
        </div>
      )}
    </>
  );
}
