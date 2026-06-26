export const CONTACT_HOUR_TABLE = {
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

export function getContactHours(clockMinutes) {
  return CONTACT_HOUR_TABLE[clockMinutes] ?? null;
}

export function getClockMinutesForContactHours(contactHours) {
  if (contactHours <= 0) return 0;

  return Object.entries(CONTACT_HOUR_TABLE)
    .map(([clockMinutes, tableContactHours]) => ({
      clockMinutes: Number(clockMinutes),
      contactHours: tableContactHours,
    }))
    .reduce((closestMatch, currentMatch) => {
      const closestDifference = Math.abs(
        closestMatch.contactHours - contactHours,
      );
      const currentDifference = Math.abs(
        currentMatch.contactHours - contactHours,
      );

      if (currentDifference < closestDifference) {
        return currentMatch;
      }

      if (
        currentDifference === closestDifference &&
        currentMatch.contactHours > closestMatch.contactHours
      ) {
        return currentMatch;
      }

      return closestMatch;
    }).clockMinutes;
}
