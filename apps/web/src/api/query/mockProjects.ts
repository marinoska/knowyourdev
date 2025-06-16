import { TProjectsItem } from "@kyd/common/api";

export const mockProjects: TProjectsItem[] = [
  {
    _id: "1",
    name: "Web Application Development",
    settings: {
      baselineJobDuration: 90,
      techFocus: ["FE", "BE"],
      description:
        "Building a modern web application with React frontend and Node.js backend",
    },
    createdAt: new Date(2023, 0, 15).toISOString(),
  },
  {
    _id: "2",
    name: "Mobile App Development",
    settings: {
      baselineJobDuration: 120,
      techFocus: ["ANDR", "IOS"],
      description:
        "Developing a cross-platform mobile application for Android and iOS",
    },
    createdAt: new Date(2023, 1, 20).toISOString(),
  },
  {
    _id: "3",
    name: "AI Research Project",
    settings: {
      baselineJobDuration: 180,
      techFocus: ["AI", "ML"],
      description:
        "Research and development of machine learning algorithms for data analysis",
    },
    createdAt: new Date(2023, 2, 10).toISOString(),
  },
  {
    _id: "4",
    name: "DevOps Infrastructure Setup",
    settings: {
      baselineJobDuration: 60,
      techFocus: ["DO", "SYS"],
      description:
        "Setting up CI/CD pipelines and cloud infrastructure for application deployment",
    },
    createdAt: new Date(2023, 3, 5).toISOString(),
  },
  {
    _id: "5",
    name: "Fullstack E-commerce Platform",
    settings: {
      baselineJobDuration: 150,
      techFocus: ["FS", "CMS"],
      description:
        "Building a complete e-commerce solution with user authentication and payment processing",
    },
    createdAt: new Date(2023, 4, 25).toISOString(),
  },
];
