import { Snackbar } from "@/components/Snackbar.tsx";
import { useParams } from "react-router-dom";
import { BasePage } from "@/components/BasePage.tsx";
import { useState } from "react";
import Tabs, { TabsRecord } from "@/components/Tabs.tsx";
import { CareerTimelineChart } from "@/pages/Resume/Chart/CareerTimelineChart.tsx";
import { CareerTechTimelineChart } from "@/pages/Resume/Chart/CareerTechTimelineChart.tsx";
import Stack from "@mui/joy/Stack";
import Divider from "@mui/joy/Divider";
import { TechTimelineChart } from "@/pages/Resume/Chart/TechTimelineChart.tsx";
import { TechDurationPieChart } from "@/pages/Resume/Chart/TechDurationPieChart.tsx";
import { TechMentionsPieChart } from "@/pages/Resume/Chart/TechMentionsPieChart.tsx";
import { monthsToYearsAndMonths } from "@/utils/dates.ts";
import { TechPopularityTimelineChart } from "@/pages/Resume/Chart/TechPopularityTimelineChart.tsx";
import { useResumeProfileQuery } from "@/api/query/useResumeProfileQuery.ts";
import { TResumeProfileDTO } from "@/api/query/types.ts";

type ResumeProfileParams = {
  id: string;
};

const TechnologiesChartGroup = ({
  profile,
}: {
  profile: TResumeProfileDTO;
}) => {
  // to not render the lower chart while the upper chat is being recalculated - to prevent flickering
  const [chartIsReady, setChartIsReady] = useState(false);
  const [chartIsEmpty, setChartIsEmpty] = useState(false);
  return (
    <>
      <TechTimelineChart
        profile={profile}
        onChartIsReady={setChartIsReady}
        onChartIsEmpty={setChartIsEmpty}
      />
      {chartIsReady && <TechDurationPieChart profile={profile} />}
      {(chartIsReady || chartIsEmpty) && (
        <TechMentionsPieChart profile={profile} />
      )}
    </>
  );
};

const getTabItems = (profile: TResumeProfileDTO): TabsRecord => ({
  timeline: {
    label: "Career Timeline",
    content: (
      <Stack gap={6}>
        <CareerTimelineChart profile={profile} />
        <Divider />
        <CareerTechTimelineChart profile={profile} />
      </Stack>
    ),
  },
  techs: {
    label: "Technologies",
    content: <TechnologiesChartGroup profile={profile} />,
  },
  insights: {
    label: "Tech insights",
    content: (
      <Stack gap={6}>
        <TechPopularityTimelineChart profile={profile} />
      </Stack>
    ),
  },
});

export const ResumeDetailsPage = () => {
  const { id } = useParams<ResumeProfileParams>();

  if (!id) {
    throw new Error(
      "Missing required parameters. Please ensure you have a valid resume ID.",
    );
  }

  const resumeProfile = useResumeProfileQuery({ uploadId: id });
  const isLoading = resumeProfile.isLoading;
  const isError = resumeProfile.isError;
  const { years, months } = monthsToYearsAndMonths(
    resumeProfile.profile?.monthsActiveInSE || 0,
  );

  return (
    <>
      <Snackbar type="danger" msg="Failed to load CV list." show={isError} />
      <BasePage
        isLoading={isLoading}
        isError={isError}
        showEmpty={!resumeProfile.profile}
      >
        <BasePage.Header
          showBackButton
          subtitle={`${resumeProfile.profile?.position} • ${years} years ${months} month net active time`}
          title={resumeProfile.profile?.fullName}
        />
        {resumeProfile.profile && (
          <Tabs tabs={getTabItems(resumeProfile.profile)} />
        )}
      </BasePage>
    </>
  );
};
