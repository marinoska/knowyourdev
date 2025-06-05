import fs from "fs";
import { TechStackModel } from "@/models/techStack.model.js";
import { TechListModel } from "@/models/techList.model.js"; // Assuming this model interacts with your database

export const saveTechNamesToFile = async (outputFilePath: string) => {
  try {
    // Step 1: Fetch all tech entries from the database
    const techDocuments = await TechListModel.find({}, { name: 1, _id: 0 }); // Only fetch the "name" field

    // Step 2: Extract names into a comma-separated string
    const techList = techDocuments.map((doc) => doc.name).join(",");

    // Step 3: Define the file path where it will be saved

    // Step 4: Write the names to a text file
    fs.writeFileSync(outputFilePath + ".txt", techList, "utf-8");
    fs.writeFileSync(
      outputFilePath + ".ts",
      `export const techList = '${techList}';`,
      "utf-8",
    );

    console.log(`Tech names saved to file: ${outputFilePath}`);
  } catch (err) {
    console.error("Error saving tech names to file:", err);
  }
};

export const saveTechStackNamesToFile = async (outputFilePath: string) => {
  try {
    // Step 1: Fetch all tech entries from the database
    const techDocuments = await TechStackModel.find(
      {},
      { name: 1, componentsString: 1, _id: 0 },
    ); // Only fetch the "name" field

    // Step 2: Extract names into a comma-separated string
    const techStackList = techDocuments
      .map((doc) => `(${doc.componentsString}) => ${doc.name}`)
      .join(",");

    // Step 3: Define the file path where it will be saved

    // Step 4: Write the names to a text file
    fs.writeFileSync(outputFilePath + ".txt", techStackList, "utf-8");
    fs.writeFileSync(
      outputFilePath + ".ts",
      `export const techStackList = '${techStackList}';`,
      "utf-8",
    );
    console.log(`Tech names saved to file: ${outputFilePath}`);
  } catch (err) {
    console.error("Error saving tech names to file:", err);
  }
};
