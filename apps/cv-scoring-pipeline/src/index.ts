import 'dotenv/config';

import { connected, stopMongoClient } from "./app/mongo.js";
import { analyzeCV } from "./loader/cv/analizer.js";


(async () => {
    await connected;
    const result = await analyzeCV("./cv/cv_marina.pdf");
    console.log("Final Evaluation:", result);

    stopMongoClient();
})();
