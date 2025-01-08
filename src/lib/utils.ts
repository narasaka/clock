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
