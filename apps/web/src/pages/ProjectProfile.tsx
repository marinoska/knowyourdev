import { Snackbar } from "@/components/Snackbar.tsx";
import { useProjectProfileQuery } from "@/api/query/useProjectsQuery.ts";
import { useParams } from "react-router-dom";
import { BasePage } from "@/components/BasePage.tsx";
import { useMemo } from "react";
import { NavigateBackLink } from "@/components/NavigateBackButton.tsx";
import Stack from "@mui/joy/Stack";
import Divider from "@mui/joy/Divider";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import { format } from "date-fns";

type ProjectProfileParams = {
  id: string;
};

export const ProjectProfile = () => {
  const { id } = useParams<ProjectProfileParams>();

  const query = useProjectProfileQuery({ projectId: id });

  return <ProjectPage query={query} />;
};

const ProjectPage = ({
  query,
}: {
  query: ReturnType<typeof useProjectProfileQuery>;
}) => {
  const { profile, isError, isLoading, showError, dismissError } = query;

  const header = useMemo(
    () => (
      <BasePage.Header
        subtitle={`Created on ${profile ? format(new Date(profile.createdAt), "MMMM d, yyyy") : ""}`}
        title={profile?.name}
        icon={BusinessCenterIcon}
      />
    ),
    [profile, profile?.name, profile?.createdAt],
  );

  return (
    <>
      <NavigateBackLink />
      {showError && (
        <Snackbar
          type="danger"
          msg="Failed to load project details."
          onClose={dismissError}
        />
      )}
      <BasePage isLoading={isLoading} isError={isError} showEmpty={!profile}>
        <BasePage.Header>{header}</BasePage.Header>
        {profile && (
          <Sheet
            sx={{
              padding: 3,
              gap: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Stack gap={2}>
              <Typography level="h4">Project Details</Typography>
              <Divider />

              <Typography component="h5">Description</Typography>
              <Typography>
                {profile.settings?.description || "No description provided."}
              </Typography>

              <Typography component="h5">Technical Focus</Typography>
              <Stack direction="row" gap={1} flexWrap="wrap">
                {profile.settings?.techFocus.map((tech) => (
                  <Sheet
                    key={tech}
                    variant="outlined"
                    sx={{
                      padding: 1,
                      borderRadius: "sm",
                      backgroundColor: "var(--joy-palette-primary-softBg)",
                    }}
                  >
                    <Typography>{tech}</Typography>
                  </Sheet>
                ))}
              </Stack>

              <Typography component="h5">Baseline Job Duration</Typography>
              <Typography>
                {profile.settings?.baselineJobDuration} days
              </Typography>
            </Stack>
          </Sheet>
        )}
      </BasePage>
    </>
  );
};
