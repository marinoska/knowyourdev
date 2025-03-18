import React from "react";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import { UploadTechProfileJobEntry } from "@kyd/types/api";

type TechTimelineProps = {
    jobs: UploadTechProfileJobEntry[];
}

export const TechTimelineChart: React.FC<TechTimelineProps> = ({jobs}) => {
    // Prepare data for the timeline
    const data = jobs.map(job => ({
        name: `${new Date(job.start!).getFullYear()} - ${new Date(job.end!).getFullYear()}`,
        duration: job.months,
        avgPopularity: job.popularity || 0,
        trending: job.trending || 0,
        technologies: job.technologies
    }));

    // Dynamic bar colors based on popularity
    const getColor = (popularity: number) => {
        if (popularity >= 40) return "#4F46E5"; // High popularity (Blue)
        if (popularity >= 20) return "#10B981"; // Medium popularity (Green)
        return "#EF4444"; // Low popularity (Red)
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Job Timeline with Tech Insights</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} layout="vertical">
                    <XAxis type="number" hide/>
                    <YAxis dataKey="name" type="category" width={100}/>
                    <Tooltip
                        content={({payload}) => {
                            if (!payload || payload.length === 0) return null;
                            const job = payload[0].payload;
                            return (
                                <div className="p-2 bg-white shadow-md rounded-md text-sm">
                                    <p><strong>Technologies:</strong></p>
                                    {job.technologies.map((tech: any) => (
                                        <div key={tech.ref} className="flex justify-between">
                                            <span>{tech.name}</span>
                                            <span>{tech.popularity} ⭐</span>
                                            <span>
                                                {tech.trending > 0 ? "📈" : tech.trending < 0 ? "📉" : "➖"}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            );
                        }}
                    />
                    <Bar dataKey="duration">
                        {data.map((job, index) => (
                            <Cell key={index} fill={getColor(job.avgPopularity)}/>
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
