import {
  addMonths,
  differenceInMonths,
  getMonth,
  getYear,
  startOfMonth,
} from "date-fns";

export const loopThroughMonths = (
  start: Date,
  end: Date,
): { year: number; month: number }[] => {
  const totalMonths = differenceInMonths(end, start);

  const result: { year: number; month: number }[] = []; // Array to store the result
  let currentDate = startOfMonth(start); // Start at the first day of the start month

  for (let i = 0; i <= totalMonths; i++) {
    result.push({
      year: getYear(currentDate), // Get the year
      month: getMonth(currentDate) + 1, // Get the month (add 1 because getMonth is 0-based)
    });

    currentDate = addMonths(currentDate, 1); // Move to the next month
  }

  return result;
};
