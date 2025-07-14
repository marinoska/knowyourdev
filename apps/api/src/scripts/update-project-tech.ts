import "dotenv/config";
import { connected, stopMongoClient } from "@/app/mongo.js";
import { ProjectModel } from "@/models/project.model.js";
import { TechListModel } from "@/models/techList.model.js";

const updateProjectTechnologies = async () => {
  try {
    // Ensure the models are initialized
    await ProjectModel.init();
    await TechListModel.init();

    // Get all technologies from the database
    const allTechnologies = await TechListModel.find({});
    console.log(`Found ${allTechnologies.length} technologies in the database.`);

    // Create a map of technology name to technology object for easier lookup
    const techByName: { [key: string]: { ref: any; code: string; name: string } } = {};
    allTechnologies.forEach((tech) => {
      techByName[tech.name] = {
        ref: tech._id,
        code: tech.code,
        name: tech.name,
      };
    });

    // Get all projects
    const projects = await ProjectModel.find({});
    console.log(`Found ${projects.length} projects to update.`);

    // Update each project
    for (const project of projects) {
      console.log(`Updating project: ${project.name}`);
      
      // Define new techFocus based on project name or other criteria
      let newTechFocus = project.settings.techFocus;
      
      // Define new technologies based on project name or other criteria
      let newTechnologies: { ref: any; code: string; name: string }[] = [];
      
      // Example: Update based on project name
      if (project.name.includes("Web")) {
        newTechFocus = ["FE", "BE"];
        const relevantTechNames = [
          "JavaScript", "TypeScript", "React.js", "Node.js", 
          "Express.js", "MongoDB", "PostgreSQL", "Next.js"
        ];
        newTechnologies = relevantTechNames
          .map((name) => techByName[name])
          .filter(Boolean);
      } 
      else if (project.name.includes("Mobile")) {
        newTechFocus = ["ANDR", "IOS", "CPM"];
        const relevantTechNames = [
          "React Native", "Flutter", "Swift", "Kotlin", 
          "JavaScript", "TypeScript"
        ];
        newTechnologies = relevantTechNames
          .map((name) => techByName[name])
          .filter(Boolean);
      }
      else if (project.name.includes("AI") || project.name.includes("ML")) {
        newTechFocus = ["AI", "ML", "DA"];
        const relevantTechNames = [
          "Python", "TensorFlow", "PyTorch", "NumPy", 
          "Pandas", "Scikit-Learn"
        ];
        newTechnologies = relevantTechNames
          .map((name) => techByName[name])
          .filter(Boolean);
      }
      else if (project.name.includes("DevOps") || project.name.includes("Infrastructure")) {
        newTechFocus = ["DO", "SYS"];
        const relevantTechNames = [
          "Docker", "Kubernetes", "Terraform", "AWS", 
          "GCP", "Ansible", "Bash/Shell"
        ];
        newTechnologies = relevantTechNames
          .map((name) => techByName[name])
          .filter(Boolean);
      }
      else {
        // Default case: Full-stack technologies
        newTechFocus = ["FE", "BE", "DO"];
        const relevantTechNames = [
          "JavaScript", "TypeScript", "React.js", "Node.js", 
          "PostgreSQL", "MongoDB", "Docker", "AWS"
        ];
        newTechnologies = relevantTechNames
          .map((name) => techByName[name])
          .filter(Boolean);
      }
      
      // Update project settings
      project.settings.techFocus = newTechFocus;
      project.settings.technologies = newTechnologies;
      
      // Save the updated project
      await project.save();
      console.log(`Project ${project.name} updated successfully.`);
    }
    
    console.log("All projects updated successfully.");
  } catch (error) {
    console.error("Error updating project technologies:", error);
    throw error;
  }
};

(async () => {
  try {
    console.log("Connecting to database...");
    await connected;
    console.log("Connected to database. Updating project technologies...");
    await updateProjectTechnologies();
    console.log("Project technologies updated successfully.");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await stopMongoClient();
  }
})();