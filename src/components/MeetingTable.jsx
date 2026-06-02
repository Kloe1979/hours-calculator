export default function MeetingTable({
  meetingRows,
  updateMeetingRow,
  deleteMeetingRow,
  addMeetingRow,
  calculateMeetingRow,
}) {
  return (
    <>
      <h2>Meeting Pattern</h2>
      <div className="table-wrapper">
        <table className="meeting-table">
          <thead>
            <tr>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Clock Hours</th>
              <th>Clock Minutes</th>
              <th>Total Clock Minutes</th>
              <th>Contact Hours</th>
              <th>Total Meetings</th>
              <th>Total Contact Hours</th>
              <th>Actions</th>
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
                  <td>
                    <input
                      type="time"
                      value={row.startTime}
                      onChange={(event) =>
                        updateMeetingRow(index, "startTime", event.target.value)
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="time"
                      value={row.endTime}
                      onChange={(event) =>
                        updateMeetingRow(index, "endTime", event.target.value)
                      }
                    />
                  </td>

                  <td>{clockHours}</td>
                  <td>{partialClockMinutes}</td>
                  <td>{totalClockMinutes}</td>
                  <td>{contactHours ?? ""}</td>

                  <td>
                    <input
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

                  <td>{totalContactHours}</td>

                  <td>
                    <button
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

      <button type="button" onClick={addMeetingRow}>
        Add Meeting Pattern
      </button>
    </>
  );
}