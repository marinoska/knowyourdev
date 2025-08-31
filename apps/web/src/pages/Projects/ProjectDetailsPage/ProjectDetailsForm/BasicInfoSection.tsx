import { Controller } from "react-hook-form";
import Stack from "@mui/joy/Stack";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Textarea,
} from "@mui/joy";
import { useProjectSettingsFormContext } from "@/pages/Projects/ProjectSettingsFormContext.tsx";

export const BasicInfoSection = () => {
  const { control } = useProjectSettingsFormContext();
  return (
    <Stack gap={2}>
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => {
          return (
            <FormControl error={!!fieldState.error}>
              <FormLabel id="project-name-label" htmlFor={field.name} required>
                Job Title / Project Name
              </FormLabel>
              <Input {...field} id="project-name" error={!!fieldState.error} />
              {fieldState.error && (
                <FormHelperText>{fieldState.error.message}</FormHelperText>
              )}
            </FormControl>
          );
        }}
      />

      <Controller
        name="settings.description"
        control={control}
        render={({ field, fieldState }) => (
          <FormControl error={!!fieldState.error}>
            <FormLabel
              id="role-description-label"
              htmlFor={field.name}
              required
            >
              Description
            </FormLabel>
            <Textarea
              {...field}
              id="role-description"
              maxRows={25}
              minRows={25}
              size="sm"
            />
            {fieldState.error && (
              <FormHelperText>{fieldState.error.message}</FormHelperText>
            )}
          </FormControl>
        )}
      />
    </Stack>
  );
};
