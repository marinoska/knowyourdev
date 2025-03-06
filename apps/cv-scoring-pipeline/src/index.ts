import 'dotenv/config';

import { connected, stopMongoClient } from "./app/mongo.js";
import { runCVDataExtraction } from "@/chain/extraction/runner.js";
import { TechModel } from "@/models/tech.model.js";
import { TechStackModel } from "@/models/techStack.model.js";
import { CvDataModel } from "@/models/cvData.model.js";

(async () => {
    await connected;
    await TechModel.init();
    await TechStackModel.init();
    await CvDataModel.init();

    // Validation failed: profileSection.text: Path `profileSection.text` is required., skillSection.text: Path `skillSection.text` is required

    try {
        const data = (await runCVDataExtraction("./cv/cv_marina.pdf"));
        // console.log("Final Evaluation:", updatedCV);
    } catch (validationError) {
        console.error("Validation failed:", validationError);
        throw validationError;
    }

    stopMongoClient();
})();
