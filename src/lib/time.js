export function timeToMinutes(timeValue) {
  if (!timeValue || !/^\d{2}:\d{2}$/.test(timeValue)) return null;

  const [hours, minutes] = timeValue.split(":").map(Number);

  if (hours > 23 || minutes > 59) return null;

  return hours * 60 + minutes;
}

export function minutesToTime(totalMinutes) {
  const minutesInDay = 24 * 60;
  const normalizedMinutes =
    ((totalMinutes % minutesInDay) + minutesInDay) % minutesInDay;
  const hours = Math.floor(normalizedMinutes / 60);
  const minutes = normalizedMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function formatClockMinutesDuration(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}:${String(minutes).padStart(2, "0")}`;
}

export function parseTimeEntry(timeValue) {
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

export function roundTimeToNearestFiveMinutes(timeValue) {
  if (!timeValue) return timeValue;

  const parsedTime = parseTimeEntry(timeValue);

  if (!parsedTime || parsedTime.hours > 23 || parsedTime.minutes > 59) {
    return "";
  }

  const roundedMinutes =
    Math.round((parsedTime.hours * 60 + parsedTime.minutes) / 5) * 5;

  return minutesToTime(roundedMinutes);
}

export function getClockMinutes(startTime, endTime) {
  if (!startTime || !endTime) return 0;

  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);

  if (start === null || end === null) return 0;

  return end - start;
}
