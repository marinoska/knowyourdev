import { add } from "date-fns";

export const monthsToYearsAndMonths = (totalMonths: number) => {
    const initialDate = new Date(0); // Start at "1970-01-01"
    const finalDate = add(initialDate, {months: totalMonths}); // Add the total months
    return {
        years: finalDate.getFullYear() - 1970, // Calculate the years since 1970
        months: finalDate.getMonth(), // Get the remaining months (0-based index)
    };
};
