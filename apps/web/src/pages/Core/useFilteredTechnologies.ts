import { useMemo, useState } from "react";
import { ScopeType } from "@kyd/common/api";
import { TResumeProfileDTO } from "@/api/query/types.ts";

export const useFilteredTechnologies = (profile: TResumeProfileDTO) => {
  const [selectedScope, setSelectedScope] = useState<ScopeType | null>(null); // Handles selected scope
  const [showKeyTechOnly, setShowKeyTechOnly] = useState(true); // Handles "skills-only" mode

  const allTechnologies = useMemo(() => {
    // filter out techs not backed by any job description
    return (profile?.technologies || []).filter(
      (tech) => tech.jobs.length > 0,
    );
  }, [profile?.technologies]);

  const filteredTechnologies = useMemo(() => {
    return allTechnologies.filter((tech) => {
      const matchesScope = !selectedScope || tech.scope === selectedScope;

      // A key technology is the one mentioned in the Skills section and also in job descriptions
      const matchesKeyTech = !showKeyTechOnly || tech.inSkillsSection;

      return matchesKeyTech && matchesScope;
    });
  }, [allTechnologies, selectedScope, showKeyTechOnly]);

  return {
    allTechnologies,
    filteredTechnologies,
    selectedScope,
    setSelectedScope,
    showKeyTechOnly,
    setShowKeyTechOnly,
  };
};
