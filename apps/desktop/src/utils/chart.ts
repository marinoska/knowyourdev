import { TechProfile } from "@/api/query/types.ts";

export const tooltip = (tech: TechProfile) => `<div style="padding: 0.5rem;font-size: 14px;">
                <p>
                    <span style="font-weight: bold;">${tech.name}</span>
                    <br>
                    <span>${tech.totalMonths ? tech.totalMonths + '&nbsp;months' : 'No&nbsp;duration&nbsp;found'}</span> 
                </p>
            </div>`;

export const tooltipField = {
    role: "tooltip",
    type: "string",
    p: {html: true}
}
