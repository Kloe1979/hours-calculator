import { useState } from "react";
import "./App.css";

function timeToMinutes(timeValue) {
  if (!timeValue) return 0;

  const [hours, minutes] = timeValue.split(":").map(Number);
  return hours * 60 + minutes;
}

function getClockMinutes(startTime, endTime) {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);

  return end - start;
}

function getContactHours(clockMinutes) {
  return CONTACT_HOUR_TABLE[clockMinutes] ?? null;
}

function round2(value) {
  return Math.round(value * 100) / 100;
}

const CONTACT_HOUR_TABLE = {
  50: 1.0,
  65: 1.3,
  70: 1.4,
  75: 1.5,
  80: 1.6,
  85: 1.7,
  90: 1.8,
  95: 1.9,
  110: 2.0,
  125: 2.3,
  130: 2.4,
  135: 2.5,
  140: 2.6,
  145: 2.7,
  150: 2.8,
  155: 2.9,
  170: 3.0,
  185: 3.3,
  190: 3.4,
  195: 3.5,
  200: 3.6,
  205: 3.7,
  230: 4.0,
  245: 4.3,
  250: 4.4,
  255: 4.5,
  260: 4.6,
  265: 4.7,
  270: 4.8,
  275: 4.9,
  290: 5.0
};

export default function App() {
  const [catalogHours, setCatalogHours] = useState(3);
  const [instructionalWeeks, setInstructionalWeeks] = useState(16);
  const [meetingsPerWeek, setMeetingsPerWeek] = useState(2);
  const [meetingRows, setMeetingRows] = useState([
    {
      startTime: "08:00",
      endTime: "09:25",
      totalMeetings: 32
    }
  ]);
  const [ftefRows, setFtefRows] = useState([
    {
      workloadFactor: 15,
      instructorAssignedHours: 45
    }
  ]);
  const totalScheduledContactHours = meetingRows.reduce((sum, row) => {
    const totalClockMinutes = getClockMinutes(row.startTime, row.endTime);
    const contactHours = getContactHours(totalClockMinutes);

    if (contactHours === null) {
      return sum;
    }

    return sum + contactHours * row.totalMeetings;
  }, 0);
  const maxHours = catalogHours * 18;
  const minHours = catalogHours * 16;
  const targetWeeklyContactHours =
    instructionalWeeks > 0
      ? maxHours / instructionalWeeks
      : 0;
  const estimatedMeetingContactHours =
    meetingsPerWeek > 0
      ? targetWeeklyContactHours / meetingsPerWeek
      : 0;

  function updateMeetingRow(index, field, value) {
    setMeetingRows((currentRows) =>
      currentRows.map((row, rowIndex) =>
        rowIndex === index
          ? { ...row, [field]: value }
          : row
      )
    );
  }

  function addMeetingRow() {
    setMeetingRows((currentRows) => [
      ...currentRows,
      {
        startTime: "",
        endTime: "",
        totalMeetings: 0
      }
    ]);
  }

  function deleteMeetingRow(indexToDelete) {
    setMeetingRows((currentRows) => {
      if (currentRows.length === 1) {
        return currentRows;
      }

      return currentRows.filter((row, index) => index !== indexToDelete);
    });
  }

  function updateFtefRow(index, field, value) {
    setFtefRows((currentRows) =>
      currentRows.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row
      )
    );
  }

  function addFtefRow() {
    setFtefRows((currentRows) => [
      ...currentRows,
      {
        workloadFactor: 0,
        instructorAssignedHours: 0
      }
    ]);
  }

  function deleteFtefRow(indexToDelete) {
    setFtefRows((currentRows) => {
      if (currentRows.length === 1) {
        return currentRows;
      }

      return currentRows.filter((row, index) => index !== indexToDelete);
    });
  }

  const totalFtefPercent = ftefRows.reduce((sum, row) => {
    const ftefPercent = row.workloadFactor > 0 ? catalogHours / row.workloadFactor : 0;
    const assignPercent = catalogHours > 0 ? row.instructorAssignedHours / catalogHours : 0;

    return sum + ftefPercent * assignPercent;
  }, 0);

  return (
    <main className="page">
      <section className="card">
      <h1>Hours Calculator</h1>
        <p className="intro">
          Enter catalog hours to calculate the semester hour range.
        </p>
      <label className="field">
        <span>Catalog Hours</span>
        <input
          type="number"
          value={catalogHours}
          onChange={(event) => setCatalogHours(Number(event.target.value))}
        />
      </label>
      <label className="field">
        <span>Instructional Weeks</span>
        <input
          type="number"
          value={instructionalWeeks}
          onChange={(event) => setInstructionalWeeks(Number(event.target.value))}
        />
      </label>
      <label className="field">
        <span>Meetings Per Week</span>
        <input
          type="number"
          value={meetingsPerWeek}
          onChange={(event) => setMeetingsPerWeek(Number(event.target.value))}
        />
      </label>

        <div className="results">
          <div className="result-card">
            <span>Maximum Hours</span>
            <strong>{maxHours}</strong>
          </div>

          <div className="result-card">
            <span>Minimum Contact Hours</span>
            <strong>{minHours}</strong>
          </div>
        </div>

        <div className="result-card">
          <span>Target Weekly Contact Hours</span>
          <strong>{targetWeeklyContactHours.toFixed(2)}</strong>
        </div>

        <div className="result-card">
          <span>Estimated Meeting Contact Hours</span>
          <strong>{estimatedMeetingContactHours.toFixed(1)}</strong>
        </div>

  <h2>Meeting Pattern</h2>

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
        const totalClockMinutes = getClockMinutes(row.startTime, row.endTime);
        const clockHours = Math.floor(totalClockMinutes / 60);
        const partialClockMinutes = totalClockMinutes % 60;
        const contactHours = getContactHours(totalClockMinutes);

        const totalContactHours =
          contactHours === null
            ? ""
            : round2(contactHours * row.totalMeetings);

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
                  updateMeetingRow(index, "totalMeetings", Number(event.target.value))
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

  <button type="button" onClick={addMeetingRow}>
    Add Meeting Pattern
  </button>

  <div className="result-card">
    <span>Total Scheduled Contact Hours</span>
    <strong>{round2(totalScheduledContactHours)}</strong>
  </div>

  <h2>Instructor FTEF</h2>

  <table className="ftef-table">
    <thead>
      <tr>
        <th>Workload Factor</th>
        <th>Catalog Hours</th>
        <th>FTEF %</th>
        <th>Class Contact Hours</th>
        <th>Instructor Assigned Hours</th>
        <th>% of Assignment</th>
        <th>Instructor FTEF</th>
        <th>Actions</th>
      </tr>
    </thead>

    <tbody>
      {ftefRows.map((row, index) => {
        const ftefPercent = row.workloadFactor > 0 ? catalogHours / row.workloadFactor : 0;
        const assignPercent = maxHours > 0 ? row.instructorAssignedHours / maxHours : 0;
        const instructorFtef = ftefPercent * assignPercent;

        return (
          <tr key={index}>
            <td>
              <input
                type="number"
                value={row.workloadFactor}
                onChange={(event) =>
                  updateFtefRow(index, "workloadFactor", Number(event.target.value) || 0)
                }
              />
            </td>

            <td>{catalogHours ?? ""}</td>
            <td>{round2(ftefPercent * 100)}%</td>
            <td>{maxHours ?? ""}</td>

            <td>
              <input
                type="number"
                value={row.instructorAssignedHours}
                onChange={(event) =>
                  updateFtefRow(index, "instructorAssignedHours", Number(event.target.value) || 0)
                }
              />
            </td>

            <td>{round2(assignPercent * 100)}%</td>
            <td>{round2(instructorFtef * 100)}%</td>

            <td>
              <button
                type="button"
                onClick={() => deleteFtefRow(index)}
                disabled={ftefRows.length === 1}
              >
                Delete
              </button>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>

  <div className="result-card">
    <span>Total FTEF%</span>
    <strong>{round2(totalFtefPercent)}</strong>
  </div>

  <button type="button" onClick={addFtefRow}>
    Add Instructor Assignment
  </button>

      </section>
    </main>
  );
}