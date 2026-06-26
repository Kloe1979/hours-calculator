import ResultCard from "./ResultCard";

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
  const cellClass = "border border-gray-300 p-2 text-center align-middle";
  const headerClass = `${cellClass} bg-gray-100 text-sm font-semibold`;
  const inputClass =
    "w-full max-w-[140px] rounded-md border border-gray-300 px-2 py-2 text-sm text-center";
  const buttonClass =
    "mt-3 cursor-pointer rounded-lg border-0 bg-[#3A6F9E] px-3 py-2.5 font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500";
  const addButtonClass =
    "min-h-[50px] cursor-pointer rounded-[7px] border border-[#2f5f88] bg-gradient-to-b from-[#477fac] to-[#3A6F9E] px-3 py-1 font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_2px_4px_rgba(0,0,0,0.14)] transition hover:from-[#5289b7] hover:to-[#3f78aa] active:translate-y-px active:shadow-[inset_0_2px_3px_rgba(0,0,0,0.16)]";
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
              <th className={headerClass}>Start Time</th>
              <th className={headerClass}>End Time</th>
              <th className={headerClass}>Clock Hours</th>
              <th className={headerClass}>Clock Minutes</th>
              <th className={headerClass}>Total Clock Minutes</th>
              <th className={headerClass}>Meeting Contact Hours</th>
              <th className={headerClass}>Number of Meetings</th>
              <th className={headerClass}>Total Contact Hours</th>
              <th className={headerClass}>Actions</th>
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
                  <td className={cellClass}>
                    <input
                      className={inputClass}
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

                  <td className={cellClass}>
                    <input
                      className={inputClass}
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

                  <td className={cellClass}>{clockHours}</td>
                  <td className={cellClass}>{partialClockMinutes}</td>
                  <td className={cellClass}>{totalClockMinutes}</td>
                  <td className={cellClass}>{contactHours ?? ""}</td>

                  <td className={cellClass}>
                    <input
                      className={inputClass}
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

                  <td className={cellClass}>{totalContactHours}</td>

                  <td className={cellClass}>
                    <button
                      className={buttonClass}
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
          className={addButtonClass}
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
