import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { UploadTechProfileJobEntry } from "@kyd/types/api";

type TechStackChartProps = {
    jobs: UploadTechProfileJobEntry[];
}

export const TechStackChart = ({jobs}: TechStackChartProps) => {
    // Aggregate technology popularity across jobs
    const techMap = new Map<string, number>();

    jobs.forEach((job) => {
        job.technologies.forEach((tech) => {
            if (techMap.has(tech.name)) {
                techMap.set(tech.name, techMap.get(tech.name)! + tech.popularity);
            } else {
                techMap.set(tech.name, tech.popularity);
            }
        });
    });

    const data = Array.from(techMap.entries()).map(([name, popularity]) => ({
        name,
        popularity,
    }));

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Technology Popularity Chart</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <XAxis dataKey="name"/>
                    <YAxis/>
                    <Tooltip/>
                    <Bar dataKey="popularity" fill="#4F46E5"/>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

