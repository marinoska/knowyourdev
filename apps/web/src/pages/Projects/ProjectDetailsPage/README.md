# React Hook Form Implementation

This directory contains an implementation of [React Hook Form](https://react-hook-form.com/) for the project settings form.

## Files

- `ProjectSettingsTab.tsx`: The main form component using React Hook Form
- `ProjectSettingsTest.tsx`: A test component that demonstrates how to use the form

## Implementation Details

The implementation uses React Hook Form to manage form state, validation, and submission. Key features include:

- Form state management with `useForm` hook
- Field validation with error messages
- Controlled form inputs using the `Controller` component
- Form submission handling
- Form reset functionality
- Conditional rendering of the submit button based on form state (dirty)
- Always visible reset button for better user experience
- Modular component architecture for better readability and maintainability

### Component Structure

The form is broken down into several reusable components:

1. **BasicInfoSection**: Handles the project name and description fields
2. **DurationSettingsSection**: Contains the slider controls for job duration and relevant years
3. **FormActions**: Manages the save and reset buttons
4. **SystemGeneratedSection**: Displays the system-generated parameters

This modular approach makes the code more maintainable and easier to understand. Each component is responsible for a specific part of the form, which improves readability and makes it easier to extend the form with new sections.

## How to Use

### Basic Usage

```tsx
import { ProjectSettingsTab } from "./ProjectSettingsTab";

// Your component
const YourComponent = ({ project }) => {
  const handleSubmit = (data) => {
    console.log("Form submitted:", data);
    // Handle form submission (e.g., API call)
  };

  return (
    <ProjectSettingsTab 
      project={project} 
      onSubmit={handleSubmit} 
    />
  );
};
```

### Form Structure

The form is structured to match the project data model:

```typescript
type ProjectFormValues = {
  name: string;
  settings: {
    description: string;
    baselineJobDuration: number;
    expectedRecentRelevantYears: number;
  };
};
```

### Validation

The form uses Yup for schema-based validation. The validation schema is defined as follows:

```typescript
const validationSchema = yup.object({
  name: yup.string().required('Project name is required'),
  settings: yup.object({
    description: yup.string().required('Description is required'),
    baselineJobDuration: yup
      .number()
      .required('Baseline job duration is required')
      .min(1, 'Minimum duration is 1 month')
      .max(36, 'Maximum duration is 36 months'),
    expectedRecentRelevantYears: yup
      .number()
      .required('Expected recent relevant years is required')
      .min(1, 'Minimum years is 1')
      .max(5, 'Maximum years is 5'),
  }),
});
```

The validation rules include:
- Project name is required
- Description is required
- Baseline job duration must be between 1 and 36 months
- Expected recent relevant years must be between 1 and 5 years

### Reset Functionality

The form includes a reset button that allows users to discard changes and revert back to the initial values:

```typescript
// Extract the reset function from useForm
const {
  control,
  handleSubmit,
  reset,
  formState: { errors, isDirty },
} = useForm<ProjectFormValues>({
  resolver: yupResolver(validationSchema),
  defaultValues: {
    // Initial values
  },
});

// Reset button implementation (always visible)
<Stack direction="row" gap={2}>
  {isDirty && (
    <Button type="submit" color="primary">
      Save Changes
    </Button>
  )}
  <Button 
    type="button" 
    color="neutral" 
    variant="outlined"
    onClick={() => reset()}
  >
    Reset
  </Button>
</Stack>
```

Key features of the reset functionality:
- The reset button is always visible for better discoverability
- Clicking the reset button reverts all form fields to their initial values
- The reset button is styled with a neutral color to distinguish it from the primary save button
- After resetting, the form returns to its pristine state and the save button disappears

## Testing

You can use the `ProjectSettingsTest` component to test the form functionality:

```tsx
import { ProjectSettingsTest } from "./ProjectSettingsTest";

// In your route or page component
const TestPage = () => {
  return <ProjectSettingsTest />;
};
```

## Extending

### Adding New Fields to Existing Components

To add more fields to existing components:

1. Update the `ProjectFormValues` type to include the new fields
2. Add the new fields to the `defaultValues` object in the `useForm` hook
3. Update the Yup validation schema to include validation rules for the new fields
4. Add new `Controller` components to the appropriate section component

Example of extending the validation schema:

```typescript
// Adding a new field to the validation schema
const validationSchema = yup.object({
  name: yup.string().required('Project name is required'),
  settings: yup.object({
    description: yup.string().required('Description is required'),
    baselineJobDuration: yup
      .number()
      .required('Baseline job duration is required')
      .min(1, 'Minimum duration is 1 month')
      .max(36, 'Maximum duration is 36 months'),
    expectedRecentRelevantYears: yup
      .number()
      .required('Expected recent relevant years is required')
      .min(1, 'Minimum years is 1')
      .max(5, 'Maximum years is 5'),
    // New field
    priority: yup
      .number()
      .required('Priority is required')
      .min(1, 'Minimum priority is 1')
      .max(10, 'Maximum priority is 10'),
  }),
});
```

### Creating New Form Sections

To add a completely new section to the form:

1. Create a new component for the section:

```typescript
// Example of a new section component
const ProjectPrioritySection = ({
  control
}: {
  control: Control<ProjectFormValues>;
}) => {
  return (
    <Card size="lg" variant="soft">
      <Stack
        direction="row"
        gap={1}
        alignItems="center"
        flexWrap="nowrap"
        justifyContent="space-between"
      >
        <FormLabel
          id="project-priority-label"
          htmlFor="project-priority"
          required
        >
          Project Priority
        </FormLabel>
        <Controller
          name="settings.priority"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <Input
                {...field}
                id="project-priority"
                type="number"
                required
                min={1}
                max={10}
              />
              {fieldState.error && (
                <FormHelperText>{fieldState.error.message}</FormHelperText>
              )}
            </>
          )}
        />
      </Stack>
    </Card>
  );
};
```

2. Update the main component to include the new section:

```typescript
return (
  <form onSubmit={handleSubmit(onSubmit)}>
    <Stack gap={2} direction="row" flexWrap="wrap" pt={1}>
      <Stack flex={1} gap={2}>
        {/* Basic information section */}
        <BasicInfoSection control={control} />

        {/* Duration settings section */}
        <DurationSettingsSection control={control} />

        {/* New priority section */}
        <ProjectPrioritySection control={control} />

        {/* Form actions */}
        <FormActions isDirty={isDirty} reset={reset} />
      </Stack>
      <Stack flex={1} gap={2}>
        {/* System-generated parameters section */}
        <SystemGeneratedSection project={project} />
      </Stack>
    </Stack>
  </form>
);
```

## Resources

- [React Hook Form Documentation](https://react-hook-form.com/get-started)
- [Controller API](https://react-hook-form.com/api/usecontroller/controller)
- [React Hook Form Validation](https://react-hook-form.com/get-started#applyvalidation)
- [Yup Documentation](https://github.com/jquense/yup)
- [Yup with React Hook Form](https://react-hook-form.com/get-started#SchemaValidation)
- [@hookform/resolvers Documentation](https://github.com/react-hook-form/resolvers)
