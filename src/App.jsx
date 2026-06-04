import { useState } from "react";
import ClassDetails from "./components/ClassDetails";
import Summary from "./components/Summary";
import MeetingTable from "./components/MeetingTable";
import FtefTable from "./components/FtefTable";

function timeToMinutes(timeValue) {
  if (!timeValue) return 0;

  const [hours, minutes] = timeValue.split(":").map(Number);
  return hours * 60 + minutes;
}

function getClockMinutes(startTime, endTime) {
  if (!startTime || !endTime) return 0;

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

const blankMeetingRow = {
  startTime: "",
  endTime: "",
  totalMeetings: ""
};

const blankFtefRow = {
  workloadFactor: "",
  instructorAssignedHours: ""
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

function calculateFtefRow(row, catalogHours, classContactHours) {
  const ftefPercent = row.workloadFactor > 0 ? catalogHours / row.workloadFactor : 0;
  const assignPercent =
    classContactHours > 0 ? row.instructorAssignedHours / classContactHours : 0;
  const instructorFtef = ftefPercent * assignPercent;

  return {
    ftefPercent,
    assignPercent,
    instructorFtef,
  };
}

export default function App() {
  const [catalogHours, setCatalogHours] = useState("");
  const [instructionalWeeks, setInstructionalWeeks] = useState("");
  const [meetingsPerWeek, setMeetingsPerWeek] = useState("");
  const [meetingRows, setMeetingRows] = useState([{ ...blankMeetingRow }]);
  const [ftefRows, setFtefRows] = useState([{ ...blankFtefRow }]);
  const totalScheduledContactHours = meetingRows.reduce((sum, row) => {
    const totalClockMinutes = getClockMinutes(row.startTime, row.endTime);
    const contactHours = getContactHours(totalClockMinutes);

    if (contactHours === null) {
      return sum;
    }

    return sum + contactHours * row.totalMeetings;
  }, 0);
  const classContactHours = round2(totalScheduledContactHours);
  const maxHours = catalogHours * 18;
  const minHours = catalogHours * 16;
  const atLeastHours = (maxHours - minHours)/2 + minHours;
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
      { ...blankMeetingRow }
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
      { ...blankFtefRow }
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
    const assignPercent =
      classContactHours > 0 ? row.instructorAssignedHours / classContactHours : 0;

    return sum + ftefPercent * assignPercent;
  }, 0);

  function clearValues() {
    setCatalogHours("");
    setInstructionalWeeks("");
    setMeetingsPerWeek("");
    setMeetingRows((currentRows) =>
      currentRows.map(() => ({ ...blankMeetingRow }))
    );
    setFtefRows((currentRows) =>
      currentRows.map(() => ({ ...blankFtefRow }))
    );
  }

  let courseStatus;
  let courseStatusColor = "warning";

  if (totalScheduledContactHours === 0) {
    courseStatus = "coming soon...";
  } else if (
    totalScheduledContactHours >= atLeastHours &&
    totalScheduledContactHours <= maxHours + 1
  ) {
    courseStatus = "good!";
    courseStatusColor = "success";
  } else if (totalScheduledContactHours > maxHours ) {
    courseStatus = "too high (goal is: " + maxHours + ")";
  } else {
    courseStatus = "too low (goal is: " + atLeastHours + " - " + maxHours + ")";
  }

  return (
    <main className="min-h-screen bg-gray-100 px-2 py-3 font-[Arial,sans-serif] text-gray-950 sm:p-3">

      <section className="mx-auto mb-3 max-w-[1200px] rounded-[18px] bg-white p-3 shadow-[0_10px_25px_rgba(0,0,0,0.08)] sm:p-4">
        <div className="grid items-center gap-2 [grid-template-columns:1fr_auto_1fr]">
          <h1 className="col-start-2 m-0 text-center text-4xl font-bold">
            Hours Calculator
          </h1>
          <button
            className="col-start-3 min-h-[44px] cursor-pointer justify-self-end rounded-[7px] border border-[#2f5f88] bg-gradient-to-b from-[#477fac] to-[#3A6F9E] px-4 py-2 font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_2px_4px_rgba(0,0,0,0.14)] transition hover:from-[#5289b7] hover:to-[#3f78aa] active:translate-y-px active:shadow-[inset_0_2px_3px_rgba(0,0,0,0.16)]"
            type="button"
            onClick={clearValues}
          >
            Clear Values
          </button>
        </div>
        <p className="text-center text-gray-600">
          Schedule as near to the maximum hours as is practical.
        </p>

        <ClassDetails
          catalogHours={catalogHours}
          setCatalogHours={setCatalogHours}
          instructionalWeeks={instructionalWeeks}
          setInstructionalWeeks={setInstructionalWeeks}
          meetingsPerWeek={meetingsPerWeek}
          setMeetingsPerWeek={setMeetingsPerWeek}
        />
 
        <Summary
          maxHours={maxHours}
          minHours={minHours}
          atLeastHours={atLeastHours}
          targetWeeklyContactHours={targetWeeklyContactHours}
          estimatedMeetingContactHours={estimatedMeetingContactHours}
        />
      </section>

      <section className="mx-auto mb-3 max-w-[1200px] rounded-[18px] bg-white p-3 shadow-[0_10px_25px_rgba(0,0,0,0.08)] sm:p-4">
        <MeetingTable
          meetingRows={meetingRows}
          updateMeetingRow={updateMeetingRow}
          deleteMeetingRow={deleteMeetingRow}
          addMeetingRow={addMeetingRow}
          calculateMeetingRow={calculateMeetingRow}
          courseStatus={courseStatus}
          courseStatusColor={courseStatusColor}
          totalScheduledContactHours={totalScheduledContactHours}
          round2={round2}
        />
      </section>

      <section className="mx-auto mb-3 max-w-[1200px] rounded-[18px] bg-white p-3 shadow-[0_10px_25px_rgba(0,0,0,0.08)] sm:p-4">
        <FtefTable
          ftefRows={ftefRows}
          updateFtefRow={updateFtefRow}
          deleteFtefRow={deleteFtefRow}
          addFtefRow={addFtefRow}
          calculateFtefRow={calculateFtefRow}
          catalogHours={catalogHours}
          classContactHours={classContactHours}
          totalFtef={totalFtef}
        />
      </section>
    </main>
  );
}
