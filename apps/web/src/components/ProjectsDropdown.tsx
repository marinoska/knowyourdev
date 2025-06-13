import { useMemo } from "react";
import { Select as JoySelect, Option, FormLabel, FormControl } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { useProjectPropsQuery } from "@/api/query/useProjectPropsQuery";

type ProjectsDropdownProps = {
  label?: string;
  selectedProject: string | null;
  onProjectChange: (newProject: string | null) => void;
  sx?: SxProps;
  placeholder?: string;
  required?: boolean;
};

export const ProjectsDropdown = ({
  label = "Project",
  selectedProject,
  onProjectChange,
  sx,
  placeholder = "Select a project",
  required = false,
}: ProjectsDropdownProps) => {
  const { data, isError, error } = useProjectPropsQuery();

  const projectNames = useMemo(() => {
    return data?.names || [];
  }, [data]);

  if (isError) {
    console.error("Error loading projects:", error);
  }

  const handleProjectChange = (newValue: string | null) => {
    onProjectChange(newValue);
  };

  return (
    <FormControl sx={sx || { width: '100%' }} required={required}>
      {label && <FormLabel>{label}</FormLabel>}

      <JoySelect
        value={selectedProject || ""}
        onChange={(_e, newValue) => handleProjectChange(newValue as string)}
        placeholder={placeholder}
        required={required}
      >
        {projectNames.map((projectName) => (
          <Option key={projectName} value={projectName}>
            {projectName}
          </Option>
        ))}
      </JoySelect>
    </FormControl>
  );
};
