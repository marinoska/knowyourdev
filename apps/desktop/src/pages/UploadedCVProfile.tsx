import { Snackbar } from "@/components/Snackbar.tsx";
import { PageHeader } from "@/pages/PageHeader.tsx";
import { useUploadProfileQuery } from "@/api/query/useUploadListQuery.ts";
import { useParams } from "react-router-dom";
import { BasePage } from "@/components/BasePage.tsx";
import { useMemo } from "react";
import Box from "@mui/joy/Box";
import AnalysisTabs, { TabItem } from "@/pages/Analisys/AnalysisTabs.tsx";
import { UploadTechProfileResponse } from "@kyd/types/api";
import { TechStackChart } from "@/pages/Analisys/TechStackChart.tsx";
import { TechTimelineChart } from "@/pages/Analisys/TechTimelineChart.tsx";

type UploadedCVProfileParams = {
    id: string;
};

const getTabItems = (upload: UploadTechProfileResponse): TabItem[] => ([
    {
        label: "Career Timeline",
        content: (<>
                <TechStackChart jobs={upload.jobs}/>
                <TechTimelineChart jobs={upload.jobs}/>
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
        <PageHeader subtitle="Senior software engineer • 8 years experience" title={"Marina Orlova"}/>), [])
    return (<>
        {showError && <Snackbar type="danger" msg="Failed to load CV list." onClose={dismissError}/>}
        <BasePage isLoading={isLoading} isError={isError} showEmpty={!upload} header={header} component={Box}>
            {upload && <AnalysisTabs tabs={getTabItems(upload)}/>}
        </BasePage>
    </>)
}