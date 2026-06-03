export default function MeetingTable({
  meetingRows,
  updateMeetingRow,
  deleteMeetingRow,
  addMeetingRow,
  calculateMeetingRow,
}) {
  const cellClass = "border border-gray-300 p-2.5 text-left align-middle";
  const headerClass = `${cellClass} bg-gray-100 font-bold`;
  const inputClass = "w-full max-w-[140px] rounded-md border border-gray-300 px-2 py-2 text-sm";
  const buttonClass =
    "mt-3 cursor-pointer rounded-lg border-0 bg-blue-600 px-3.5 py-2.5 font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500";

  return (
    <>
      <h2 className="mt-0 mb-2 text-center text-2xl font-bold">Meeting Pattern</h2>
      <div className="overflow-x-auto">
        <table className="mt-4 w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className={headerClass}>Start Time</th>
              <th className={headerClass}>End Time</th>
              <th className={headerClass}>Clock Hours</th>
              <th className={headerClass}>Clock Minutes</th>
              <th className={headerClass}>Total Clock Minutes</th>
              <th className={headerClass}>Contact Hours</th>
              <th className={headerClass}>Total Meetings</th>
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
              } = calculateMeetingRow(row);

              return (
                <tr key={index}>
                  <td className={cellClass}>
                    <input
                      className={inputClass}
                      type="time"
                      value={row.startTime}
                      onChange={(event) =>
                        updateMeetingRow(index, "startTime", event.target.value)
                      }
                    />
                  </td>

                  <td className={cellClass}>
                    <input
                      className={inputClass}
                      type="time"
                      value={row.endTime}
                      onChange={(event) =>
                        updateMeetingRow(index, "endTime", event.target.value)
                      }
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
                      value={row.totalMeetings}
                      onChange={(event) =>
                        updateMeetingRow(
                          index,
                          "totalMeetings",
                          Number(event.target.value)
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

      <button className={buttonClass} type="button" onClick={addMeetingRow}>
        Add Meeting Pattern
      </button>
    </>
  );
}
