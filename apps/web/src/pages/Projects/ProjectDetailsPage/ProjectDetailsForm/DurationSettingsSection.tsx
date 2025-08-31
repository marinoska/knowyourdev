import { Controller } from "react-hook-form";
import Stack from "@mui/joy/Stack";
import { Card, FormLabel, Slider } from "@mui/joy";
import { Subtitle } from "@/components/typography.tsx";
import { useProjectSettingsFormContext } from "@/pages/Projects/ProjectSettingsFormContext.tsx";
import {
  MAX_EXPECTED_DURATION,
  MIN_BASELINE_DURATION,
  MIN_EXPECTED_DURATION,
  MAX_BASELINE_DURATION,
} from "@kyd/common/api";

export const DurationSettingsSection = () => {
  const { control } = useProjectSettingsFormContext();
  return (
    <Stack gap={2}>
      <Card size="lg" variant="soft">
        <Controller
          name="settings.baselineJobDuration"
          control={control}
          render={({ field }) => (
            <>
              <Stack
                direction="row"
                gap={1}
                alignItems="center"
                flexWrap="nowrap"
                justifyContent="space-between"
              >
                <FormLabel
                  id="baseline-job-duration-label"
                  htmlFor="baseline-job-duration"
                  required
                >
                  Expected tenure at a job
                </FormLabel>
                <Subtitle>{field.value} months</Subtitle>
              </Stack>
              <Slider
                {...field}
                id="baseline-job-duration"
                min={MIN_BASELINE_DURATION}
                max={MAX_BASELINE_DURATION}
                defaultValue={18}
                step={1}
                marks
                valueLabelDisplay="on"
                onChange={(_, value) => field.onChange(value)}
              />
            </>
          )}
        />
      </Card>
      <Card size="lg" variant="soft">
        <Controller
          name="settings.expectedRecentRelevantYears"
          control={control}
          render={({ field }) => (
            <>
              <Stack
                direction="row"
                gap={1}
                alignItems="center"
                flexWrap="nowrap"
                justifyContent="space-between"
              >
                <FormLabel
                  id="expected-recent-relevant-years-label"
                  htmlFor="expected-recent-relevant-years"
                  required
                >
                  Expected recent relevant years
                </FormLabel>
                <Subtitle>{field.value} years</Subtitle>
              </Stack>
              <Slider
                {...field}
                id="expected-recent-relevant-years"
                min={MIN_EXPECTED_DURATION}
                max={MAX_EXPECTED_DURATION}
                defaultValue={3}
                step={1}
                marks
                valueLabelDisplay="on"
                onChange={(_, value) => field.onChange(value)}
              />
            </>
          )}
        />
      </Card>
    </Stack>
  );
};
