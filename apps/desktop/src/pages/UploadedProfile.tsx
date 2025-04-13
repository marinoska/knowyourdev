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
import { ChartProvider, useChartContext } from "@/pages/Analisys/ChartContext/ChartContext.tsx";
import { CareerTechChart } from "@/pages/Analisys/Chart/CareerTechChart.tsx";
import Stack from "@mui/joy/Stack";
import Divider from "@mui/joy/Divider";
import { TechSkillsTimelineChart } from "@/pages/Analisys/Chart/TechSkillsTimelineChart.tsx";
import { TechSkillsDurationPieChart } from "@/pages/Analisys/Chart/TechSkillsDurationPieChart.tsx";
import { TechMentionsPieChart } from "@/pages/Analisys/Chart/TechMentionsPieChart.tsx";
import { monthsToYearsAndMonths } from "@/utils/dates";

type UploadedProfileParams = {
    id: string;
};

const TechnologiesChartGroup = () => {
    // to not render the lower chart while the upper chat is being recalculated - to prevent flickering
    const [chartIsReady, setChartIsReady] = useState(false);
    const [chartIsEmpty, setChartIsEmpty] = useState(false);
    return (<>
        <TechSkillsTimelineChart setChartIsReady={setChartIsReady} setChartIsEmpty={setChartIsEmpty}/>
        {chartIsReady && <TechSkillsDurationPieChart/>}
        {(chartIsReady || chartIsEmpty) && <TechMentionsPieChart/>}
    </>)
}

const getTabItems = (): TabItem[] => ([
    {
        label: "Career Timeline",
        content: (<Stack gap={6}>
                <CareerTimelineChart/>
                <Divider/>
                <CareerTechChart/>
            </Stack>
        )
    },
    {
        label: "Technologies",
        content: <TechnologiesChartGroup/>,
    },
    {
        label: "Tech insights",
        content: <div>Content for Strengths & Suitability</div>,
    },
]);

export const UploadedProfile = () => {
    const {id} = useParams<UploadedProfileParams>();

    const query = useUploadProfileQuery({uploadId: id});

    return (
        <ChartProvider profile={query.profile}>
            <UploadPage query={query}/>
        </ChartProvider>
    );
}

const UploadPage = ({query}: { query: ReturnType<typeof useUploadProfileQuery> }) => {
    const {profile, isError, isLoading, showError, dismissError} = query;
    const {monthsActive} = useChartContext();

    const {years, months} = monthsToYearsAndMonths(monthsActive)
    const header = useMemo(() => (
        <PageHeader subtitle={`${profile?.position} • ${years} years ${months} month net active time`}
                    title={profile?.fullName}/>), [profile?.position, profile?.fullName, years, months])
    return (<>
        <NavigateBackLink/>
        {showError && <Snackbar type="danger" msg="Failed to load CV list." onClose={dismissError}/>}
        <BasePage isLoading={isLoading} isError={isError} showEmpty={!profile} header={header} component={Box}>
            {profile && <AnalysisTabs tabs={getTabItems()}/>}
        </BasePage>
    </>)
}