import { Snackbar } from "@/components/Snackbar.tsx";
import { PageHeader } from "@/pages/PageHeader.tsx";
import { useUploadProfileQuery } from "@/api/query/useUploadListQuery.ts";
import { useParams } from "react-router-dom";
import { BasePage } from "@/components/BasePage.tsx";
import { useMemo } from "react";
import Box from "@mui/joy/Box";
import AnalysisTabs, { TabItem } from "@/pages/Analisys/AnalysisTabs.tsx";
import { UploadTechProfileResponse } from "@kyd/types/api";
import { CareerTimelineChart } from "@/pages/Analisys/CareerTimelineChart.tsx";
import JobChart from "@/pages/Analisys/PopularityTimelineChart.tsx";
import { NavigateBackLink } from "@/components/NavigateBackButton.tsx";

type UploadedCVProfileParams = {
    id: string;
};

const getTabItems = (upload: UploadTechProfileResponse): TabItem[] => ([
    {
        label: "Career Timeline",
        content: (<>
                {/*<TechStackChart jobs={upload.jobs}/>*/}
                <CareerTimelineChart jobs={upload.jobs}/>
                <JobChart jobs={upload.jobs}/>
            </>
        )
    },
    {
        label: "Red Flags",
        content: <div>Content for Red Flags</div>,
    },
    {
        label: "Strengths & Suitability",
        content: <div>Content for Strengths & Suitability</div>,
    },
]);

export const UploadedCVProfile = () => {
    const {id} = useParams<UploadedCVProfileParams>();

    const {data: upload, isError, isLoading, showError, dismissError} = useUploadProfileQuery({uploadId: id || ''});
    const header = useMemo(() => (
        <PageHeader subtitle={`${upload?.position} • 8 years experience`}
                    title={upload?.fullName}/>), [upload?.fullName, upload?.position])
    return (<>
        <NavigateBackLink/>
        {showError && <Snackbar type="danger" msg="Failed to load CV list." onClose={dismissError}/>}
        <BasePage isLoading={isLoading} isError={isError} showEmpty={!upload} header={header} component={Box}>
            {upload && <AnalysisTabs tabs={getTabItems(upload)}/>}
        </BasePage>
    </>)
}