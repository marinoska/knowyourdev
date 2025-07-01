// import {
//   ResumeTechProfileResponse,
//   ResumeTechProfileTechnologiesEntry,
//   ScopeType,
//   ScopePeriod,
//   TScopeActivity,
//   TScopes,
// } from "@kyd/common/api";
// import {
//   addMonths,
//   differenceInMonths,
//   endOfMonth,
//   getMonth,
//   getYear,
//   startOfMonth,
//   subMonths,
// } from "date-fns";
//
// /**
//  * Calculate scopes for a tech profile
//  * @param techProfile The tech profile response
//  * @param earliestJobStart The earliest job start date
//  * @returns Object containing scopes data
//  */
// export function calculateScopes(
//   techProfile: ResumeTechProfileResponse,
//   earliestJobStart: Date,
// ): TScopes {
//   const result = {} as TScopes;
//   if (!techProfile.technologies) {
//     return result;
//   }
//
//   const uploadDate = startOfMonth(new Date(techProfile.createdAt));
//   const scopeTechnologies = {} as Record<
//     ScopeType,
//     ResumeTechProfileTechnologiesEntry[]
//   >;
//
//   for (const tech of techProfile.technologies) {
//     if (!tech.scope) continue;
//
//     if (!result[tech.scope]) {
//       result[tech.scope] = {
//         periods: [],
//         years: {},
//       };
//       scopeTechnologies[tech.scope] = [];
//     }
//
//     for (const job of tech.jobs) {
//       const jobStart =
//         typeof job.start === "object" ? job.start : new Date(job.start);
//       const jobEnd = typeof job.end === "object" ? job.end : new Date(job.end);
//
//       loopThroughMonths(jobStart, jobEnd).map(({ year, month }) => {
//         // create bit matrix (year, month) where we mark 1 on intersections.
//         result[tech.scope].years[year]
//           ? (result[tech.scope].years[year][month - 1] = 1)
//           : (result[tech.scope].years[year] = Array(12).fill(0));
//       });
//     }
//     scopeTechnologies[tech.scope].push(tech);
//   }
//
//   // Calculate 12-month periods from upload date
//   for (const scopeKey of Object.keys(result)) {
//     const scope = scopeKey as ScopeType;
//     const scopeData = result[scope];
//
//     // Create periods (12-month chunks) going back from upload date to earliest job start
//     let periodEnd = endOfMonth(subMonths(new Date(uploadDate), 1));
//     let periodStart = startOfMonth(subMonths(periodEnd, 11));
//
//     // Keep creating periods until we reach or go past the earliest job start date
//     do {
//       addPeriod(scopeData, periodStart, periodEnd, scopeTechnologies[scope]);
//       periodStart = subMonths(periodStart, 12);
//       periodEnd = subMonths(periodEnd, 12);
//     } while (periodStart >= earliestJobStart);
//
//     // Sort periods from the last backwards (most recent first)
//     scopeData.periods.sort((a, b) => b.endDate.getTime() - a.endDate.getTime());
//   }
//
//   return result;
// }
//
// /**
//  * Add scopes to the tech profile response
//  * @param techProfile The tech profile response with job categories
//  * @returns The tech profile response with scopes added
//  */
// export function addScopesToResponse(
//   techProfile: ResumeTechProfileResponse & { earliestJobStart?: Date },
// ): ResumeTechProfileResponse {
//   if (!techProfile.earliestJobStart) {
//     return techProfile;
//   }
//
//   const scopes = calculateScopes(techProfile, techProfile.earliestJobStart);
//   return {
//     ...techProfile,
//     scopes,
//   };
// }
//
// // Helper function to add a period with filtered technologies
// function addPeriod(
//   scopeData: TScopeActivity,
//   periodStart: Date,
//   periodEnd: Date,
//   technologies: ResumeTechProfileTechnologiesEntry[],
// ) {
//   scopeData.periods.push({
//     startDate: periodStart,
//     endDate: periodEnd,
//     totalMonths: loopThroughMonths(periodStart, periodEnd).reduce(
//       (acc, { year, month }) => {
//         acc += scopeData.years[year]?.[month - 1] || 0;
//         return acc;
//       },
//       0,
//     ),
//     technologies: technologies
//       .map((tech) => ({
//         name: tech.name,
//         totalMonths: tech.totalMonths || 0,
//       }))
//       .filter((tech) => {
//         // Check if technology was used in this period
//         return technologies.some((originalTech) => {
//           return (
//             originalTech.name === tech.name &&
//             originalTech.jobs.some((job) => {
//               const jobStart =
//                 typeof job.start === "object"
//                   ? job.start
//                   : job.start
//                     ? new Date(job.start)
//                     : null;
//               const jobEnd =
//                 typeof job.end === "object"
//                   ? job.end
//                   : job.end
//                     ? new Date(job.end)
//                     : new Date();
//
//               // Check if job overlaps with period
//               return (
//                 (!jobStart || jobStart <= periodEnd) && jobEnd >= periodStart
//               );
//             })
//           );
//         });
//       }),
//   });
// }
//
// const loopThroughMonths = (
//   start: Date,
//   end: Date,
// ): { year: number; month: number }[] => {
//   const totalMonths = differenceInMonths(end, start);
//
//   const result: { year: number; month: number }[] = []; // Array to store the result
//   let currentDate = startOfMonth(start); // Start at the first day of the start month
//
//   for (let i = 0; i <= totalMonths; i++) {
//     result.push({
//       year: getYear(currentDate), // Get the year
//       month: getMonth(currentDate) + 1, // Get the month (add 1 because getMonth is 0-based)
//     });
//
//     currentDate = addMonths(currentDate, 1); // Move to the next month
//   }
//
//   return result;
// };
