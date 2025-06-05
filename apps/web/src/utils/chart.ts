import { TechProfile } from "@/api/query/types.ts";
import { monthsToYearsAndMonths } from "@/utils/dates.ts";

export const pieTooltip = (
  tech: TechProfile,
) => `<div style="padding: 0.5rem;font-size: 14px;">
                <p>
                    <span style="font-weight: bold;">${tech.name}</span>
                    <br>
                    <span>${tech.totalMonths ? tech.totalMonths + "&nbsp;months" : "No&nbsp;duration&nbsp;found"}</span> 
                </p>
            </div>`;

export const timelineTooltip = ({
  role,
  company,
  totalMonths,
  summary,
}: {
  role: string;
  company: string;
  totalMonths: number;
  summary: string;
}) => {
  const { years, months } = monthsToYearsAndMonths(totalMonths);
  return `<div style="padding:0.5rem;margin:0;font-size: 14px;white-space: nowrap;">
                <p style="padding:0;margin:0;">
                    <strong>${company}</strong>
                </p>                <p style="padding:0;margin:0;">
                    <strong>${role}: -<strong>
                </p>
                    <br>
                    <strong>Duration:</strong> <span>${years} years, ${months} months</span>
                        ${summary ? `<strong>Summary:</strong> ${summary}` : ""}
 
            </div>`;
};

export const tooltipField = {
  role: "tooltip",
  type: "string",
  p: { html: true },
} as const;

export const tooltipOptions = {
  tooltip: {
    trigger: "focus", // Tooltip appears on hover
    isHtml: true, // Enables HTML tooltips for custom content
  },
} as const;

export const defaultTimelineOptions = {
  showRowLabels: true,
  groupByRowLabel: true,
  colorByRowLabel: true,

  rowLabelStyle: { fontSize: 14 },
  barLabelStyle: { fontSize: 14 },
};
