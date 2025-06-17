import "dotenv/config";
import { connected, stopMongoClient } from "@/app/mongo.js";
import { ProjectModel } from "@/models/project.model.js";

// Import mock projects data
const mockProjects = [
  {
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

const loadMockProjects = async () => {
  try {
    // Check if projects already exist
    const existingCount = await ProjectModel.countDocuments();
    if (existingCount > 0) {
      console.log(`Found ${existingCount} existing projects. Skipping insertion.`);
      return;
    }

    // Insert mock projects
    const result = await ProjectModel.insertMany(mockProjects);
    console.log(`Successfully inserted ${result.length} mock projects.`);
  } catch (error) {
    console.error("Error loading mock projects:", error);
    throw error;
  }
};

(async () => {
  try {
    console.log("Connecting to database...");
    await connected;
    console.log("Connected to database. Loading mock projects...");
    await loadMockProjects();
    console.log("Mock projects loaded successfully.");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await stopMongoClient();
  }
})();