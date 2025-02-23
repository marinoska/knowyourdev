import 'dotenv/config';

import { connected, stopMongoClient } from "./app/mongo.js";
import { runCVDataExtraction } from "./chains/extraction/runner.js";
import { TechModel } from "@/models/tech.model.js";
import { TechStackModel } from "@/models/techStack.model.js";
import { CVDataModel } from "@/models/CVData.model..js";


(async () => {
    await connected;
    await TechModel.init();
    await TechStackModel.init();
    await CVDataModel.init();

    // ValidationError: Validation failed: technologies.18.name: Path `name` is required., jobs.0.description:
    // Path `description` is required., jobs.0.present: Path `present` is required., jobs.0.months: Path `months` is required., jobs.0.end:
    // Path `end` is required., jobs.0.start: Path `start` is required., jobs.0.job: Path `job` is required., jobs.0.role: Path `role` is required.

    const data = await runCVDataExtraction("./cv/cv_marina.pdf");
    const updatedCV = await CVDataModel.findOneAndUpdate(
        {hash: data.hash}, // Find by hash
        {$set: data}, // Set new or updated fields
        {upsert: true, new: true, runValidators: true} // Create if not exists, return updated, apply schema validations
    );
    console.log("Final Evaluation:", updatedCV);

    stopMongoClient();
})();
