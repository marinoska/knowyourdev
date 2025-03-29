import { createContext, ReactNode, useContext, useMemo } from "react";
import { Job, ProcessedUploadProfile } from "@/api/query/types.ts";
import { getJobGaps } from "@/pages/Analisys/Career/ranges.ts";
import { GAP_JOB, GAP_ROLE } from "@kyd/common";

export type Gap = Pick<Job, 'job' | 'role' | 'months' | 'start' | 'end' | 'popularity'>;
type ChartContextType = {
    jobGaps: Gap[];
    profile?: ProcessedUploadProfile;
};


const ChartContext = createContext<ChartContextType>({
    jobGaps: [],
    profile: undefined,
});
export const useChartContext = () => {
    return useContext(ChartContext);
};

export function ChartProvider({children, profile}: { children: ReactNode, profile?: ProcessedUploadProfile }) {
    const jobGaps = useMemo<Gap[]>(() => {
        if (!profile?.jobs) {
            return [];
        }

        const sortedJobs = profile.jobs.sort((a, b) => a.start.getTime() - b.start.getTime());
        const gapsRanges = getJobGaps(sortedJobs);

        return [
            ...gapsRanges.map((range) => ({
                role: GAP_ROLE,
                job: GAP_JOB,
                start: range.start,
                end: range.end,
                months: range.months,
                popularity: 0,
            })),
        ];
    }, [profile?.jobs]);

    const context = useMemo(() => ({
        jobGaps,
        profile,
    }), [jobGaps, profile]);

    return (
        <ChartContext.Provider value={context}>
            {children}
        </ChartContext.Provider>
    );
}
