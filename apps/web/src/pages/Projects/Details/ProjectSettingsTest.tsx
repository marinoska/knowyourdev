import { useState } from "react";
import { ProjectSettingsContent } from "./ProjectSettingsContent";
import { Button, Stack, Typography } from "@mui/joy";

// Mock project data for testing
const mockProject = {
  _id: "test-project-id",
  name: "Test Project",
  createdAt: new Date().toISOString(),
  settings: {
    description: "This is a test project description",
    baselineJobDuration: 18,
    expectedRecentRelevantYears: 3,
    techFocus: ["FRONTEND", "BACKEND"],
    technologies: [
      { ref: "tech1", code: "react", name: "React" },
      { ref: "tech2", code: "node", name: "Node.js" }
    ]
  },
  candidates: []
};

// Test component to demonstrate the form functionality
export const ProjectSettingsTest = () => {
  const [formData, setFormData] = useState<any>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (data: any) => {
    setFormData(data);
    setIsSubmitted(true);
    console.log("Form submitted with data:", data);
  };

  return (
    <Stack gap={4} p={2}>
      <Typography level="h2">Project Settings Form Test</Typography>
      
      <ProjectSettingsContent 
        project={mockProject} 
        onSubmit={handleSubmit} 
      />
      
      {isSubmitted && (
        <Stack gap={2}>
          <Typography level="h3">Form Submitted Successfully!</Typography>
          <Typography>Form data:</Typography>
          <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}>
            {JSON.stringify(formData, null, 2)}
          </pre>
          <Button 
            onClick={() => setIsSubmitted(false)} 
            color="neutral" 
            variant="outlined"
          >
            Reset
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default ProjectSettingsTest;