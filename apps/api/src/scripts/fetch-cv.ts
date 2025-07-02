import "dotenv/config";
import { connected, stopMongoClient } from "@/app/mongo.js";
import { ResumeDataModel } from "@/models/resumeDataModel.js";
import { TechListModel } from "@/models/techList.model.js";
import { parseMonthEndUtc, parseMonthStartUtc } from "@/utils/dates.js";

const UPLOAD_ID = "68618b60ab76870de11a45d7";

const fetchCV = async () => {
  try {
    // Find the CV data for the specific upload ID
    const cv = await ResumeDataModel.findOne({ uploadRef: UPLOAD_ID })
      .populate({
        path: "jobs.technologies.techReference", // Populate nested techReference in jobs array
      })
      .transform((doc) => {
        const jobs = doc?.jobs.map((job, i) => {
          console.log("Index @@@@@", i);
          console.info(`${job.end} ${job.role} ${job._id}`);
          console.info(
            `job.end ${parseMonthEndUtc(job.end).toISOString()} ${job.role} ${job._id}`,
          );
          return {
            ...job,
            start: parseMonthStartUtc(job.start),
            end: parseMonthEndUtc(job.end),
          };
        });

        return { ...doc, jobs };
      });

    if (!cv) {
      console.error(`No CV found for upload ID: ${UPLOAD_ID}`);
      return;
    }

    console.log("CV Data found:");
  } catch (error) {
    console.error("Error fetching CV data:", error);
    throw error;
  }
};

(async () => {
  try {
    console.log("Connecting to database...");
    await connected;
    console.log("Connected to database. Initializing models...");
    await TechListModel.init();
    console.log("Models initialized. Fetching CV data...");
    await fetchCV();
    console.log("CV data fetched successfully.");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await stopMongoClient();
  }
})();
