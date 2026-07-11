export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function queryStringFormatter(searchParamsObj: {
  [key: string]: string | string[] | undefined;
}): string {
  let queryString = "";
  const queryArray = Object.entries(searchParamsObj).map(([key, value]) => {
    if (Array.isArray(value)) {
      return value.map((v) => `${key}=${encodeURIComponent(v)}`).join("&");
    } else if (value !== undefined) {
      return `${key}=${encodeURIComponent(value)}`;
    }
    return "";
  });
  queryString = queryArray.filter((q) => q !== "").join("&");
  return queryString;
}

export const formatDuration = (minutes: number): string => {
  if (!Number.isFinite(minutes) || minutes <= 0) {
    return "Invalid duration";
  }

  const MINUTES_IN_DAY = 1440;
  const MINUTES_IN_HOUR = 60;

  // Prefer days if divisible by 1 day
  if (minutes >= MINUTES_IN_DAY && minutes % MINUTES_IN_DAY === 0) {
    const days = minutes / MINUTES_IN_DAY;
    return `${days} Day${days > 1 ? "s" : ""}`;
  }

  // Otherwise show hours (can be fractional)
  const hours = minutes / MINUTES_IN_HOUR;

  // Remove .0 for whole numbers
  const formattedHours = Number.isInteger(hours)
    ? hours
    : Number(hours.toFixed(1));

  return `${formattedHours} Hour${formattedHours > 1 ? "s" : ""}`;
};
