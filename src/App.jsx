import { useState } from "react";
import ClassDetails from "./components/ClassDetails";
import Summary from "./components/Summary";
import MeetingTable from "./components/MeetingTable";
import FtefTable from "./components/FtefTable";
import { calculateFtefRow, calculateMeetingRow } from "./lib/calculations";
import {
  getClockMinutesForContactHours,
  getContactHours,
} from "./lib/contactHours";
import { round2 } from "./lib/format";
import {
  formatClockMinutesDuration,
  getClockMinutes,
  roundTimeToNearestFiveMinutes,
} from "./lib/time";
import { isNonNegativeInputValue } from "./lib/validation";

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
  const targetMeetingClockHours = formatClockMinutesDuration(
    getClockMinutesForContactHours(targetMeetingContactHours),
  );
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
          targetMeetingClockHours={targetMeetingClockHours}
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
