import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatClockMinutesDuration,
  getClockMinutes,
  minutesToTime,
  roundTimeToNearestFiveMinutes,
  timeToMinutes,
} from "./time.js";

describe("time helpers", () => {
  it("converts valid HH:MM values to minutes", () => {
    assert.equal(timeToMinutes("09:30"), 570);
    assert.equal(timeToMinutes("23:59"), 1439);
  });

  it("rejects malformed and out-of-range times", () => {
    assert.equal(timeToMinutes("9:30"), null);
    assert.equal(timeToMinutes("24:00"), null);
    assert.equal(timeToMinutes("12:60"), null);
  });

  it("formats minutes as normalized HH:MM values", () => {
    assert.equal(minutesToTime(570), "09:30");
    assert.equal(minutesToTime(1440), "00:00");
    assert.equal(minutesToTime(-5), "23:55");
  });

  it("formats clock-minute durations as H:MM values", () => {
    assert.equal(formatClockMinutesDuration(0), "0:00");
    assert.equal(formatClockMinutesDuration(50), "0:50");
    assert.equal(formatClockMinutesDuration(125), "2:05");
  });

  it("rounds typed time entries to the nearest five minutes", () => {
    assert.equal(roundTimeToNearestFiveMinutes("9:30"), "09:30");
    assert.equal(roundTimeToNearestFiveMinutes("932"), "09:30");
    assert.equal(roundTimeToNearestFiveMinutes("933"), "09:35");
    assert.equal(roundTimeToNearestFiveMinutes("23:58"), "00:00");
  });

  it("returns zero clock minutes for incomplete or invalid values", () => {
    assert.equal(getClockMinutes("", "10:00"), 0);
    assert.equal(getClockMinutes("bad", "10:00"), 0);
  });
});
