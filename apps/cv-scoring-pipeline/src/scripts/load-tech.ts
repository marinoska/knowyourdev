import 'dotenv/config';
import csvParser from 'csv-parser';
import fs from 'fs';
import path from 'path';
import TechModel from "../tech/tech.model.js";

import { connected, stopMongoClient, db } from "../app/mongo.js";

// Path to the CSV file
const CSV_FILE_PATH = path.resolve(process.cwd() + '/files/');
type TechCSVData = {
    name: string;
    code: string;
    trend: string;
    category: string;
    usage2024?: number;
    usage2016?: number;
}

const dropExistingCollection = async (name: string) => {
    const collections = await db
        .listCollections();

    console.log({collections})
    if (collections.includes(
        {name})) {
        console.log('Dropping existing collection and indexes...');
        // Drop the collection (removes documents and associated indexes)
        await db.dropCollection(name);
        console.log(`Collection ${name} and indexes dropped`);
    } else {
        console.log(`Collection ${name} does not exist, skipping drop operation.`);
    }
};

// Function to load data from CSV
const loadTechData = async (fileName: string) => {
    const data: TechCSVData[] = [];
    try {
        await new Promise((resolve, reject) => {
            fs.createReadStream(path.resolve(CSV_FILE_PATH, fileName))
                .pipe(csvParser())
                .on('data', (row) => {
                    // Explicitly map CSV column names to document fields
                    data.push({
                        name: row.Name,
                        code: row.Name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase(),
                        trend: row.Trend.split(/\s+/).map((word: string) => word.charAt(0).toUpperCase()).join(''),
                        category: row.Category,
                        usage2024: row.Usage2024 ? Number(row.Usage2024) : undefined,
                        usage2016: row.Usage2016 ? Number(row.Usage2016) : undefined,
                    });
                })
                .on('end', () => {
                    console.log('CSV file successfully processed');
                    resolve(0);
                })
                .on('error', (err) => reject(err));
        });

        // Insert data into the database
        const result = await TechModel.insertMany(data);
        console.log(`${result.length} documents successfully inserted.`);
    } catch (err) {
        console.error('Error loading data:', err);
    } finally {
        // Close the MongoDB connection
        void stopMongoClient();
    }
};

(async () => {
    await connected;
    await dropExistingCollection("tech");
    void loadTechData("Tech.csv");
})();

