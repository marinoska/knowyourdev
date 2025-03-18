import { Snackbar } from "@/components/Snackbar.tsx";
import { PageHeader } from "@/pages/PageHeader.tsx";
import { useUploadProfileQuery } from "@/api/query/useUploadListQuery.ts";
import { useParams } from "react-router-dom";
import { BasePage } from "@/components/BasePage.tsx";
import { useMemo } from "react";
import Box from "@mui/joy/Box";
import AnalysisTabs from "@/pages/Analisys/AnalysisTabs.tsx";

type UploadedCVProfileParams = {
    id: string;
};
export const UploadedCVProfile = () => {
    const {id} = useParams<UploadedCVProfileParams>();
    console.log({id});
    const {data: upload, isError, isLoading, showError, dismissError} = useUploadProfileQuery({uploadId: id || ''});
    const header = useMemo(() => (
        <PageHeader subtitle="Senior software engineer • 8 years experience" title={"Marina Orlova"}/>), [])
    return (<>
        {showError && <Snackbar type="danger" msg="Failed to load CV list." onClose={dismissError}/>}
        <BasePage isLoading={isLoading} isError={isError} showEmpty={!upload} header={header} component={Box}>
            <AnalysisTabs/>
        </BasePage>
    </>)
}