import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { calculateFtefRow, calculateMeetingRow } from "./calculations.js";
import {
  getClockMinutesForContactHours,
  getContactHours,
} from "./contactHours.js";
import { isNonNegativeInputValue } from "./validation.js";

describe("contact hour calculations", () => {
  it("looks up known contact-hour values", () => {
    assert.equal(getContactHours(50), 1);
    assert.equal(getContactHours(65), 1.3);
    assert.equal(getContactHours(60), null);
  });

  it("finds the closest clock minutes for a target contact-hour value", () => {
    assert.equal(getClockMinutesForContactHours(0), 0);
    assert.equal(getClockMinutesForContactHours(1), 50);
    assert.equal(getClockMinutesForContactHours(1.5), 75);
    assert.equal(getClockMinutesForContactHours(2.15), 125);
  });

  it("calculates a meeting row from times and meeting count", () => {
    assert.deepEqual(
      calculateMeetingRow({
        startTime: "09:00",
        endTime: "10:05",
        totalMeetings: "10",
      }),
      {
        totalClockMinutes: 65,
        clockHours: 1,
        partialClockMinutes: 5,
        contactHours: 1.3,
        totalContactHours: 13,
      },
    );
  });
});

describe("FTEF calculations", () => {
  it("uses inherited catalog and contact hours when row values are blank", () => {
    const result = calculateFtefRow(
      {
        workloadFactor: "525",
        catalogHours: "",
        classContactHours: "",
        instructorAssignedHours: "54",
      },
      "3",
      54,
    );

    assert.equal(result.rowCatalogHours, "3");
    assert.equal(result.rowClassContactHours, 54);
    assert.equal(result.ftefPercent, 3 / 525);
    assert.equal(result.assignPercent, 1);
  });

  it("uses row override values when provided", () => {
    const result = calculateFtefRow(
      {
        workloadFactor: "525",
        catalogHours: "4",
        classContactHours: "72",
        instructorAssignedHours: "36",
      },
      "3",
      54,
    );

    assert.equal(result.rowCatalogHours, "4");
    assert.equal(result.rowClassContactHours, "72");
    assert.equal(result.ftefPercent, 4 / 525);
    assert.equal(result.assignPercent, 0.5);
  });
});

describe("input validation", () => {
  it("rejects negative input strings", () => {
    assert.equal(isNonNegativeInputValue("3"), true);
    assert.equal(isNonNegativeInputValue(""), true);
    assert.equal(isNonNegativeInputValue("-3"), false);
  });
});
