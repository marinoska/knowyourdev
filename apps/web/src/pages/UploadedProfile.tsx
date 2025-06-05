import { Snackbar } from "@/components/Snackbar.tsx";
import { PageHeader } from "@/pages/PageHeader.tsx";
import { useUploadProfileQuery } from "@/api/query/useUploadsQuery.ts";
import { useParams } from "react-router-dom";
import { BasePage } from "@/components/BasePage.tsx";
import { useMemo, useState } from "react";
import Box from "@mui/joy/Box";
import AnalysisTabs, { TabItem } from "@/pages/Analisys/AnalysisTabs.tsx";
import { CareerTimelineChart } from "@/pages/Analisys/Chart/CareerTimelineChart.tsx";
import { NavigateBackLink } from "@/components/NavigateBackButton.tsx";
import {
  ChartProvider,
  useChartContext,
} from "@/pages/Analisys/Chart/Core/ChartContext.tsx";
import { CareerTechTimelineChart } from "@/pages/Analisys/Chart/CareerTechTimelineChart.tsx";
import Stack from "@mui/joy/Stack";
import Divider from "@mui/joy/Divider";
import { TechTimelineChart } from "@/pages/Analisys/Chart/TechTimelineChart.tsx";
import { TechDurationPieChart } from "@/pages/Analisys/Chart/TechDurationPieChart.tsx";
import { TechMentionsPieChart } from "@/pages/Analisys/Chart/TechMentionsPieChart.tsx";
import { monthsToYearsAndMonths } from "@/utils/dates";
import { TechPopularityTimelineChart } from "@/pages/Analisys/Chart/TechPopularityTimelineChart.tsx";

type UploadedProfileParams = {
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

const getTabItems = (): TabItem[] => [
  {
    label: "Career Timeline",
    content: (
      <Stack gap={6}>
        <CareerTimelineChart />
        <Divider />
        <CareerTechTimelineChart />
      </Stack>
    ),
  },
  {
    label: "Technologies",
    content: <TechnologiesChartGroup />,
  },
  {
    label: "Tech insights",
    content: (
      <Stack gap={6}>
        <TechPopularityTimelineChart />
      </Stack>
    ),
  },
];

export const UploadedProfile = () => {
  const { id } = useParams<UploadedProfileParams>();

  const query = useUploadProfileQuery({ uploadId: id });

  return (
    <ChartProvider profile={query.profile}>
      <UploadPage query={query} />
    </ChartProvider>
  );
};

const UploadPage = ({
  query,
}: {
  query: ReturnType<typeof useUploadProfileQuery>;
}) => {
  const { profile, isError, isLoading, showError, dismissError } = query;
  const { monthsActive } = useChartContext();

  const { years, months } = monthsToYearsAndMonths(monthsActive);
  const header = useMemo(
    () => (
      <PageHeader
        subtitle={`${profile?.position} • ${years} years ${months} month net active time`}
        title={profile?.fullName}
      />
    ),
    [profile?.position, profile?.fullName, years, months],
  );
  return (
    <>
      <NavigateBackLink />
      {showError && (
        <Snackbar
          type="danger"
          msg="Failed to load CV list."
          onClose={dismissError}
        />
      )}
      <BasePage
        isLoading={isLoading}
        isError={isError}
        showEmpty={!profile}
        header={header}
        component={Box}
      >
        {profile && <AnalysisTabs tabs={getTabItems()} />}
      </BasePage>
    </>
  );
};
