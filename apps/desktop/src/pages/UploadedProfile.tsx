import { Snackbar } from "@/components/Snackbar.tsx";
import { PageHeader } from "@/pages/PageHeader.tsx";
import { useUploadProfileQuery } from "@/api/query/useUploadsQuery.ts";
import { useParams } from "react-router-dom";
import { BasePage } from "@/components/BasePage.tsx";
import { useMemo } from "react";
import Box from "@mui/joy/Box";
import AnalysisTabs, { TabItem } from "@/pages/Analisys/AnalysisTabs.tsx";
import { CareerTimelineChart } from "@/pages/Analisys/Career/CareerTimelineChart.tsx";
import { NavigateBackLink } from "@/components/NavigateBackButton.tsx";
import { ChartProvider } from "@/pages/Analisys/ChartContext/ChartContext.tsx";
import { CareerTechChart } from "@/pages/Analisys/Career/CareerTechChart.tsx";
import Stack from "@mui/joy/Stack";
import Divider from "@mui/joy/Divider";

type UploadedProfileParams = {
    id: string;
};

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
        label: "Career Tech Stack",
        content: (<>
            </>
        ),
    },
    {
        label: "Technologies",
        content: <div>Content for Strengths & Suitability</div>,
    },
    {
        label: "Tech popularity and trends",
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
    const header = useMemo(() => (
        <PageHeader subtitle={`${profile?.position} • 8 years experience`}
                    title={profile?.fullName}/>), [profile?.fullName, profile?.position])
    return (<>
        <NavigateBackLink/>
        {showError && <Snackbar type="danger" msg="Failed to load CV list." onClose={dismissError}/>}
        <BasePage isLoading={isLoading} isError={isError} showEmpty={!profile} header={header} component={Box}>
            {profile && <AnalysisTabs tabs={getTabItems()}/>}
        </BasePage>
    </>)
}