import { useMemo, useState } from "react";
import { useChartContext } from "@/pages/Resume/Chart/Core/ChartContext.ts";
import { ScopeType } from "@kyd/common/api";

export const useFilteredTechnologies = () => {
  const [selectedScope, setSelectedScope] = useState<ScopeType | null>(null); // Handles selected scope
  const [showKeyTechOnly, setShowKeyTechOnly] = useState(true); // Handles "skills-only" mode

  const chartContext = useChartContext();

  const allTechnologies = useMemo(() => {
    // filter out techs not backed by any job description
    return (chartContext.profile?.technologies || []).filter(
      (tech) => tech.jobs.length > 0,
    );
  }, [chartContext.profile?.technologies]);

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
