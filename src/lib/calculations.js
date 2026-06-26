import { getContactHours } from "./contactHours.js";
import { round2 } from "./format.js";
import { getClockMinutes } from "./time.js";

export function calculateMeetingRow(row) {
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

export function getEffectiveFtefValues(row, catalogHours, classContactHours) {
  return {
    catalogHours: row.catalogHours === "" ? catalogHours : row.catalogHours,
    classContactHours:
      row.classContactHours === "" ? classContactHours : row.classContactHours,
  };
}

export function calculateFtefRow(row, catalogHours, classContactHours) {
  const {
    catalogHours: rowCatalogHours,
    classContactHours: rowClassContactHours,
  } = getEffectiveFtefValues(row, catalogHours, classContactHours);
  const ftefPercent =
    row.workloadFactor > 0 ? rowCatalogHours / row.workloadFactor : 0;
  const assignPercent =
    rowClassContactHours > 0
      ? row.instructorAssignedHours / rowClassContactHours
      : 0;
  const instructorFtef = ftefPercent * assignPercent;

  return {
    rowCatalogHours,
    rowClassContactHours,
    ftefPercent,
    assignPercent,
    instructorFtef,
  };
}
