import { Snackbar } from "@/components/Snackbar.tsx";
import { useParams } from "react-router-dom";
import { BasePage } from "@/components/BasePage.tsx";
import { useState } from "react";
import Tabs, { TabsRecord } from "@/components/Tabs.tsx";
import { CareerTimelineChart } from "@/pages/Resume/Chart/CareerTimelineChart.tsx";
import { ResumeProfileProvider } from "@/pages/Core/ResumeProfileProvider.tsx";
import { CareerTechTimelineChart } from "@/pages/Resume/Chart/CareerTechTimelineChart.tsx";
import Stack from "@mui/joy/Stack";
import Divider from "@mui/joy/Divider";
import { TechTimelineChart } from "@/pages/Resume/Chart/TechTimelineChart.tsx";
import { TechDurationPieChart } from "@/pages/Resume/Chart/TechDurationPieChart.tsx";
import { TechMentionsPieChart } from "@/pages/Resume/Chart/TechMentionsPieChart.tsx";
import { monthsToYearsAndMonths } from "@/utils/dates.ts";
import { TechPopularityTimelineChart } from "@/pages/Resume/Chart/TechPopularityTimelineChart.tsx";
import { useResumeProfileContext } from "@/pages/Core/ResumeProfileContext.ts";
import { useResumeProfileQuery } from "@/api/query/useResumeProfileQuery.ts";

type ResumeProfileParams = {
  id: string;
};

const TechnologiesChartGroup = () => {
  // to not render the lower chart while the upper chat is being recalculated - to prevent flickering
  const [chartIsReady, setChartIsReady] = useState(false);
  const [chartIsEmpty, setChartIsEmpty] = useState(false);
  return (
    <>
      <TechTimelineChart
        onChartIsReady={setChartIsReady}
        onChartIsEmpty={setChartIsEmpty}
      />
      {chartIsReady && <TechDurationPieChart />}
      {(chartIsReady || chartIsEmpty) && <TechMentionsPieChart />}
    </>
  );
};

const getTabItems = (): TabsRecord => ({
  timeline: {
    label: "Career Timeline",
    content: (
      <Stack gap={6}>
        <CareerTimelineChart />
        <Divider />
        <CareerTechTimelineChart />
      </Stack>
    ),
  },
  techs: {
    label: "Technologies",
    content: <TechnologiesChartGroup />,
  },
  insights: {
    label: "Tech insights",
    content: (
      <Stack gap={6}>
        <TechPopularityTimelineChart />
      </Stack>
    ),
  },
});

export const ResumeDetailsPage = () => {
  const { id } = useParams<ResumeProfileParams>();

  const query = useResumeProfileQuery({ uploadId: id });

  return (
    <ResumeProfileProvider profile={query.profile}>
      <ResumeDetails query={query} />
    </ResumeProfileProvider>
  );
};

const ResumeDetails = ({
  query: { profile, isError, isLoading },
}: {
  query: ReturnType<typeof useResumeProfileQuery>;
}) => {
  const { monthsActive } = useResumeProfileContext();

  const { years, months } = monthsToYearsAndMonths(monthsActive);

  return (
    <>
      <Snackbar type="danger" msg="Failed to load CV list." show={isError} />
      <BasePage isLoading={isLoading} isError={isError} showEmpty={!profile}>
        <BasePage.Header
          showBackButton
          subtitle={`${profile?.position} • ${years} years ${months} month net active time`}
          title={profile?.fullName}
        />
        {profile && <Tabs tabs={getTabItems()} />}
      </BasePage>
    </>
  );
};
