import { useState } from "react";
import "./App.css";
import ResultCard from "./components/ResultCard";
import MeetingTable from "./components/MeetingTable";
import FtefTable from "./components/FtefTable";

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

function calculateMeetingRow(row) {
  const totalClockMinutes = getClockMinutes(row.startTime, row.endTime);
  const clockHours = Math.floor(totalClockMinutes / 60);
  const partialClockMinutes = totalClockMinutes % 60;
  const contactHours = getContactHours(totalClockMinutes);

  const totalContactHours =
    contactHours === null ? "" : round2(contactHours * row.totalMeetings);

  return {
    totalClockMinutes,
    clockHours,
    partialClockMinutes,
    contactHours,
    totalContactHours,
  };
}

function calculateFtefRow(row, catalogHours, maxHours) {
  const ftefPercent = row.workloadFactor > 0 ? catalogHours / row.workloadFactor : 0;
  const assignPercent = maxHours > 0 ? row.instructorAssignedHours / maxHours : 0;
  const instructorFtef = ftefPercent * assignPercent;

  return {
    ftefPercent,
    assignPercent,
    instructorFtef,
  };
}

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

  const totalFtef = ftefRows.reduce((sum, row) => {
    const ftefPercent = row.workloadFactor > 0 ? catalogHours / row.workloadFactor : 0;
    const assignPercent = catalogHours > 0 ? row.instructorAssignedHours / catalogHours : 0;

    return sum + ftefPercent * assignPercent;
  }, 0);

    let courseStatus = "Not Scheduled";
    let courseStatusColor = "warning";

    if (totalScheduledContactHours === 0) {
      courseStatus = "No Meeting Pattern Entered";
    }
    else if (
      totalScheduledContactHours >= minHours &&
      totalScheduledContactHours <= maxHours
    ) {
      courseStatus = "Within Range";
      courseStatusColor = "success";
    }
    else if (totalScheduledContactHours > maxHours) {
      courseStatus = "Over Scheduled";
    }
    else {
      courseStatus = "Under Scheduled";
    }

  return (
    <main className="page">
      <section className="card">
      <h1>Hours Calculator</h1>
        <p className="intro">
          Enter catalog hours to calculate the semester hour range.
        </p>

      <h2>Class Details</h2>

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


     </section>

      <section className="card">
        <h2>Summary</h2>

          <div className="results">
            <ResultCard title="Maximum Hours" value={maxHours}   color="success"/>
            <ResultCard title="Minimum Contact Hours" value={minHours}   color="warning"/>
            <ResultCard title="Target Weekly Contact Hours" value={targetWeeklyContactHours.toFixed(2)}   color="info"/>
            <ResultCard title="Estimated Meeting Contact Hours" value={estimatedMeetingContactHours.toFixed(1)}   color="info"/>
            <ResultCard title="Course Status" value={courseStatus} color={courseStatusColor} />
            <ResultCard title="Total Scheduled Contact Hours" value={round2(totalScheduledContactHours)} color="success" />
            <ResultCard title="Total FTEF%" value={round2(totalFtef)} color="success" />
          </div>

      </section>

      <section className="card">
        <MeetingTable
          meetingRows={meetingRows}
          updateMeetingRow={updateMeetingRow}
          deleteMeetingRow={deleteMeetingRow}
          addMeetingRow={addMeetingRow}
          calculateMeetingRow={calculateMeetingRow}
        />
      </section>

      <section className="card">
        <FtefTable
          ftefRows={ftefRows}
          updateFtefRow={updateFtefRow}
          deleteFtefRow={deleteFtefRow}
          addFtefRow={addFtefRow}
          calculateFtefRow={calculateFtefRow}
          catalogHours={catalogHours}
          maxHours={maxHours}
        /> 
        </section>
  </main>
  );
}