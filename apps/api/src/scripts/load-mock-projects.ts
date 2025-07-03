import "dotenv/config";
import { connected, stopMongoClient, db } from "@/app/mongo.js";
import { ProjectModel } from "@/models/project.model.js";
import { TechListModel } from "@/models/techList.model.js";
import { TProjectResponse } from "@kyd/common/api";

// Mock projects data from mockProjects.ts
const mockProjects = [
  {
    name: "Web Application Development",
    settings: {
      baselineJobDuration: 90,
      techFocus: ["FE", "BE"],
      description:
        "Building a modern web application with React frontend and Node.js backend",
      expectedRecentRelevantYears: 5,
    },
    candidates: [],
    createdAt: new Date(2023, 0, 15).toISOString(),
  },
  {
    name: "Mobile App Development",
    settings: {
      expectedRecentRelevantYears: 1,
      baselineJobDuration: 120,
      techFocus: ["ANDR", "IOS"],
      description:
        "Developing a cross-platform mobile application for Android and iOS",
    },
    candidates: [],
    createdAt: new Date(2023, 1, 20).toISOString(),
  },
  {
    name: "AI Research Project",
    settings: {
      expectedRecentRelevantYears: 2,
      baselineJobDuration: 180,
      techFocus: ["AI", "ML"],
      description:
        "Research and development of machine learning algorithms for data analysis",
    },
    candidates: [],
    createdAt: new Date(2023, 2, 10).toISOString(),
  },
  {
    name: "DevOps Infrastructure Setup",
    settings: {
      expectedRecentRelevantYears: 3,
      baselineJobDuration: 60,
      techFocus: ["DO", "SYS"],
      description:
        "Setting up CI/CD pipelines and cloud infrastructure for application deployment",
    },
    candidates: [],
    createdAt: new Date(2023, 3, 5).toISOString(),
  },
  {
    name: "Fullstack E-commerce Platform",
    settings: {
      expectedRecentRelevantYears: 5,
      baselineJobDuration: 15,
      techFocus: ["FE", "BE", "DO", "CMS"],
      description:
        "Building a complete e-commerce solution with user authentication and payment processing",
    },
    candidates: [],
    createdAt: new Date(2023, 4, 25).toISOString(),
  },
];

const dropExistingCollection = async (name: string) => {
  try {
    const collections = await db.listCollections();
    if (collections.filter((coll) => coll.name === name).length > 0) {
      console.log(`Dropping existing collection ${name}...`);
      await db.dropCollection(name);
      console.log(`Collection ${name} dropped successfully.`);
    } else {
      console.log(
        `Collection ${name} does not exist, skipping drop operation.`,
      );
    }
  } catch (error) {
    console.error(`Error dropping collection ${name}:`, error);
    throw error;
  }
};

const loadMockProjects = async () => {
  try {
    // Drop the existing Project collection
    await dropExistingCollection("Project");

    // Ensure the models are initialized
    await ProjectModel.init();
    await TechListModel.init();

    // Get all technologies from the database to get their IDs
    const allTechnologies = await TechListModel.find({});

    // Create a map of technology name to technology object for easier lookup
    const techByName = {};
    allTechnologies.forEach(tech => {
      techByName[tech.name] = {
        ref: tech._id,
        code: tech.code,
        name: tech.name
      };
    });

    // Define relevant technologies for each project
    const projectsWithTechnologies = mockProjects.map(project => {
      let technologies = [];

      // Assign specific technologies based on project name
      if (project.name === "Web Application Development") {
        // Modern web app with React frontend and Node.js backend
        const relevantTechNames = ["JavaScript", "TypeScript", "React.js", "Node.js", "Express.js", "MongoDB", "PostgreSQL"];
        technologies = relevantTechNames.map(name => techByName[name]).filter(Boolean);
      } 
      else if (project.name === "Mobile App Development") {
        // Cross-platform mobile app for Android and iOS
        const relevantTechNames = ["React Native", "Flutter", "Swift", "Kotlin", "JavaScript", "TypeScript"];
        technologies = relevantTechNames.map(name => techByName[name]).filter(Boolean);
      }
      else if (project.name === "AI Research Project") {
        // AI/ML research project
        const relevantTechNames = ["Python", "TensorFlow", "PyTorch", "NumPy", "Pandas", "Scikit-Learn"];
        technologies = relevantTechNames.map(name => techByName[name]).filter(Boolean);
      }
      else if (project.name === "DevOps Infrastructure Setup") {
        // DevOps and infrastructure
        const relevantTechNames = ["Docker", "Kubernetes", "Terraform", "AWS", "GCP", "Ansible", "Bash/Shell"];
        technologies = relevantTechNames.map(name => techByName[name]).filter(Boolean);
      }
      else if (project.name === "Fullstack E-commerce Platform") {
        // Fullstack e-commerce platform
        const relevantTechNames = ["JavaScript", "TypeScript", "React.js", "Node.js", "PostgreSQL", "MongoDB", "Next.js", "AWS", "Docker"];
        technologies = relevantTechNames.map(name => techByName[name]).filter(Boolean);
      }

      return {
        ...project,
        settings: {
          ...project.settings,
          technologies
        }
      };
    });

    // Insert mock projects with technologies
    const result = await ProjectModel.insertMany(projectsWithTechnologies);
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
