import { TProjectDTO } from "@/api/query/types.ts";

export const mockProjects: TProjectDTO[] = [
  {
    _id: "1",
    name: "Web Application Development",
    settings: {
      baselineJobDuration: 90,
      techFocus: ["FE", "BE"],
      description:
        "Building a modern web application with React frontend and Node.js backend",
      expectedRecentRelevantYears: 5,
      technologies: [],
    },
    candidates: [],
    createdAt: new Date(2023, 0, 15),
  },
  {
    _id: "2",
    name: "Mobile App Development",
    settings: {
      expectedRecentRelevantYears: 1,
      baselineJobDuration: 120,
      techFocus: ["ANDR", "IOS"],
      description:
        "Developing a cross-platform mobile application for Android and iOS",
      technologies: [],
    },
    candidates: [],
    createdAt: new Date(2023, 1, 20),
  },
  {
    _id: "3",
    name: "AI Research Project",
    settings: {
      expectedRecentRelevantYears: 2,
      baselineJobDuration: 180,
      techFocus: ["AI", "ML"],
      description:
        "Research and development of machine learning algorithms for data analysis",
      technologies: [],
    },
    candidates: [],
    createdAt: new Date(2023, 2, 10),
  },
  {
    _id: "4",
    name: "DevOps Infrastructure Setup",
    settings: {
      expectedRecentRelevantYears: 3,
      baselineJobDuration: 60,
      techFocus: ["DO", "SYS"],
      description:
        "Setting up CI/CD pipelines and cloud infrastructure for application deployment",
      technologies: [],
    },
    candidates: [],
    createdAt: new Date(2023, 3, 5),
  },
  {
    _id: "5",
    name: "Fullstack E-commerce Platform",
    settings: {
      expectedRecentRelevantYears: 5,
      baselineJobDuration: 15,
      techFocus: ["FE", "BE", "DO", "CMS"],
      description:
        "Building a complete e-commerce solution with user authentication and payment processing",
      technologies: [],
    },
    candidates: [],
    createdAt: new Date(2023, 4, 25),
  },
];
