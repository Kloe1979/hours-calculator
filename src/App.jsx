import { useState } from "react";
import ClassDetails from "./components/ClassDetails";
import Summary from "./components/Summary";
import MeetingTable from "./components/MeetingTable";
import FtefTable from "./components/FtefTable";

function timeToMinutes(timeValue) {
  if (!timeValue || !/^\d{2}:\d{2}$/.test(timeValue)) return null;

  const [hours, minutes] = timeValue.split(":").map(Number);

  if (hours > 23 || minutes > 59) return null;

  return hours * 60 + minutes;
}

function minutesToTime(totalMinutes) {
  const minutesInDay = 24 * 60;
  const normalizedMinutes =
    ((totalMinutes % minutesInDay) + minutesInDay) % minutesInDay;
  const hours = Math.floor(normalizedMinutes / 60);
  const minutes = normalizedMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function parseTimeEntry(timeValue) {
  if (!timeValue) return null;

  const trimmedValue = timeValue.trim();
  const colonMatch = trimmedValue.match(/^(\d{1,2}):(\d{1,2})$/);

  if (colonMatch) {
    const [, hours, minutes] = colonMatch;
    return {
      hours: Number(hours),
      minutes: Number(minutes),
    };
  }

  const digitsOnly = trimmedValue.replace(/\D/g, "");

  if (digitsOnly.length === 0 || digitsOnly.length > 4) {
    return null;
  }

  if (digitsOnly.length <= 2) {
    return {
      hours: Number(digitsOnly),
      minutes: 0,
    };
  }

  return {
    hours: Number(digitsOnly.slice(0, -2)),
    minutes: Number(digitsOnly.slice(-2)),
  };
}

function roundTimeToNearestFiveMinutes(timeValue) {
  if (!timeValue) return timeValue;

  const parsedTime = parseTimeEntry(timeValue);

  if (!parsedTime || parsedTime.hours > 23 || parsedTime.minutes > 59) {
    return "";
  }

  const roundedMinutes =
    Math.round((parsedTime.hours * 60 + parsedTime.minutes) / 5) * 5;

  return minutesToTime(roundedMinutes);
}

function getClockMinutes(startTime, endTime) {
  if (!startTime || !endTime) return 0;

  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);

  if (start === null || end === null) return 0;

  return end - start;
}

function getContactHours(clockMinutes) {
  return CONTACT_HOUR_TABLE[clockMinutes] ?? null;
}

function round2(value) {
  return Math.round(value * 100) / 100;
}

function isNonNegativeInputValue(value) {
  return !String(value).includes("-");
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
  290: 5.0,
  305: 5.3,
  310: 5.4,
  315: 5.5,
  320: 5.6,
  325: 5.7,
  330: 5.8,
  335: 5.9,
  350: 6.0,
  365: 6.3,
  370: 6.4,
  375: 6.5,
  380: 6.6,
  385: 6.7,
  390: 6.8,
  395: 6.9,
};

const blankMeetingRow = {
  startTime: "",
  endTime: "",
  totalMeetings: "",
};

const blankFtefRow = {
  workloadFactor: "",
  catalogHours: "",
  classContactHours: "",
  instructorAssignedHours: "",
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
  const rowCatalogHours =
    row.catalogHours === "" ? catalogHours : row.catalogHours;
  const rowClassContactHours =
    row.classContactHours === "" ? classContactHours : row.classContactHours;
  const ftefPercent =
    row.workloadFactor > 0 ? rowCatalogHours / row.workloadFactor : 0;
  const assignPercent =
    rowClassContactHours > 0
      ? row.instructorAssignedHours / rowClassContactHours
      : 0;
  const instructorFtef = ftefPercent * assignPercent;

  return {
    ftefPercent,
    assignPercent,
    instructorFtef,
  };
}

export default function App() {
  const [catalogHours, setCatalogHours] = useState("");
  const [numberOfMeetings, setNumberOfMeetings] = useState("");
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
  const atLeastHours = catalogHours * 17;
  const minHours = catalogHours * 16;
  const targetMeetingContactHours =
    numberOfMeetings > 0 ? maxHours / numberOfMeetings : 0;
  const showMinimumMeetingContactHoursMessage =
    maxHours > 0 && numberOfMeetings > 0 && targetMeetingContactHours < 1;

  function setNonNegativeValue(setValue, value) {
    if (isNonNegativeInputValue(value)) {
      setValue(value);
    }
  }

  function updateNumberOfMeetings(value) {
    if (!isNonNegativeInputValue(value)) return;

    setMeetingRows((currentRows) =>
      currentRows.map((row) =>
        row.totalMeetings === "" || row.totalMeetings === numberOfMeetings
          ? { ...row, totalMeetings: value }
          : row,
      ),
    );
    setNumberOfMeetings(value);
  }

  function updateMeetingRow(index, field, value) {
    if (!isNonNegativeInputValue(value)) return;

    setMeetingRows((currentRows) =>
      currentRows.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row,
      ),
    );
  }

  function normalizeMeetingRowTime(index, field) {
    setMeetingRows((currentRows) =>
      currentRows.map((row, rowIndex) =>
        rowIndex === index
          ? { ...row, [field]: roundTimeToNearestFiveMinutes(row[field]) }
          : row,
      ),
    );
  }

  function addMeetingRow() {
    setMeetingRows((currentRows) => [
      ...currentRows,
      { ...blankMeetingRow, totalMeetings: numberOfMeetings },
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
    if (!isNonNegativeInputValue(value)) return;

    setFtefRows((currentRows) =>
      currentRows.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row,
      ),
    );
  }

  function addFtefRow() {
    setFtefRows((currentRows) => [...currentRows, { ...blankFtefRow }]);
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
    const { instructorFtef } = calculateFtefRow(
      row,
      catalogHours,
      classContactHours,
    );

    return sum + instructorFtef;
  }, 0);

  function clearValues() {
    setCatalogHours("");
    setNumberOfMeetings("");
    setMeetingRows((currentRows) =>
      currentRows.map(() => ({ ...blankMeetingRow })),
    );
    setFtefRows((currentRows) => currentRows.map(() => ({ ...blankFtefRow })));
  }

  let courseStatus;
  let courseStatusColor = "warning";

  if (maxHours === 0) {
    courseStatus = "...";
  } else if (totalScheduledContactHours === 0) {
    courseStatus = "coming soon...";
  } else if (
    totalScheduledContactHours >= atLeastHours &&
    totalScheduledContactHours <= maxHours + 1
  ) {
    courseStatus = "good!";
    courseStatusColor = "success";
  } else if (totalScheduledContactHours > maxHours) {
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
          setCatalogHours={(value) => setNonNegativeValue(setCatalogHours, value)}
          numberOfMeetings={numberOfMeetings}
          setNumberOfMeetings={updateNumberOfMeetings}
          showMinimumMeetingContactHoursMessage={
            showMinimumMeetingContactHoursMessage
          }
        />

        <Summary
          maxHours={maxHours}
          minHours={minHours}
          atLeastHours={atLeastHours}
          targetMeetingContactHours={targetMeetingContactHours}
        />
      </section>

      <section className="mx-auto mb-3 max-w-[1200px] rounded-[18px] bg-white p-3 shadow-[0_10px_25px_rgba(0,0,0,0.08)] sm:p-4">
        <MeetingTable
          meetingRows={meetingRows}
          updateMeetingRow={updateMeetingRow}
          normalizeMeetingRowTime={normalizeMeetingRowTime}
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
