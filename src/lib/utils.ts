import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface TimezoneWithOffset {
  timezone: string;
  offset: string;
}
export function getTimezonesWithOffsets() {
  const timezones = Intl.supportedValuesOf("timeZone");
  const result: TimezoneWithOffset[] = [];
  const now = dayjs();
  for (const timezone of timezones) {
    result.push({
      timezone,
      offset: now.tz(timezone).format("Z"),
    });
  }
  return result;
}

export function filterTimezones(
  timezones: TimezoneWithOffset[],
  query: string,
): TimezoneWithOffset[] {
  if (!query.trim()) return timezones;

  const normalizedQuery = query.toLowerCase().trim();
  const cleanedQuery = normalizedQuery.replace(/^gmt/, "");
  const searchTerms = cleanedQuery.split(/\s+/);

  return timezones.filter((tz) => {
    const timezoneLower = tz.timezone.toLowerCase();
    const offsetLower = tz.offset.toLowerCase();
    const offsetNumeric = offsetLower
      .replace(":00", "")
      .replace("+", "")
      .replace("-", "");
    const offsetShort = offsetLower.replace(":00", "");

    const searchableText = [
      timezoneLower,
      offsetLower,
      offsetShort,
      offsetNumeric,
    ].join(" ");

    return searchTerms.every((term) => searchableText.includes(term));
  });
}
