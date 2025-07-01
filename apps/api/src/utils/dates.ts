import { parse, isValid } from "date-fns";
import logger from "@/app/logger.js";

const log = logger("date:convertion");

const FormatString = "MM-yyyy";
export function parseMonthStartUtc(
  value: string,
  formatStr = FormatString,
): Date {
  const dt: Date = parse(value, formatStr, new Date());
  if (!isValid(dt)) {
    throw new Error(`Invalid start date ${value}`);
  }
  return new Date(Date.UTC(dt.getFullYear(), dt.getMonth(), 1, 0, 0, 0, 0));
}

export function parseMonthEndUtc(
  value: string,
  formatStr = FormatString,
): Date {
  let dt = parse(value, formatStr, new Date());
  if (!isValid(dt)) {
    log.warn(`Invalid end date  ${value}`);
    dt = new Date();
  }

  return new Date(
    Date.UTC(dt.getFullYear(), dt.getMonth() + 1, 0, 23, 59, 59, 999),
  );
}
