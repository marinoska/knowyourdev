import 'dotenv/config';
import csvParser from 'csv-parser';
import fs from 'fs';
import path from 'path';

import { connected, db, stopMongoClient } from "../app/mongo";
import { CategoryType, ScopeType, StackComponents, TechStackCategory, TrendType } from "@/models/types";
import { TechStackModel } from "@/models/techStack.model";
// import { saveTechNamesToFile, saveTechStackNamesToFile } from "./export-tech-names";
import { TechModel } from "@/models/tech.model";
import { generateTechCode } from "@/utils/func";

// Path to the CSV file
const CSV_FILE_PATH = path.resolve(process.cwd() + '/files/');
type TechCSVData = {
    name: string;
    code: string;
    trend: TrendType;
    category: CategoryType;
    scope: ScopeType;
    usage2024?: number;
    usage2016?: number;
}

const dropExistingCollection = async (name: string) => {
    const collections = await db
        .listCollections();
    if (collections.filter(
        coll => coll.name === name)) {
        console.log('Dropping existing collection and indexes...');
        // Drop the collection (removes documents and associated indexes)
        await db.dropCollection(name);
        console.log(`Collection ${name} and indexes dropped`);
    } else {
        console.log(`Collection ${name} does not exist, skipping drop operation.`);
    }
};

const loadTechData = async (fileName: string) => {
    const data: TechCSVData[] = [];
    try {
        await new Promise((resolve, reject) => {
            fs.createReadStream(path.resolve(CSV_FILE_PATH, fileName))
                .pipe(csvParser())
                .on('data', (row) => {
                    data.push({
                        name: row.Name.trim(),
                        code: generateTechCode(row.Name),
                        trend: row.Trend.split(/\s+/).map((word: string) => word.charAt(0).toUpperCase()).join(''),
                        category: row.Category.trim(),
                        scope: row.Scope.trim(),
                        usage2024: row.Usage2024 ? Number(row.Usage2024) : undefined,
                        usage2016: row.Usage2016 ? Number(row.Usage2016) : undefined,
                    });
                })
                .on('end', () => {
                    console.log(`CSV file ${fileName} successfully processed`);
                    resolve(0);
                })
                .on('error', reject);
        });

        // Insert data into the database
        const result = await TechModel.insertMany(data);
        console.log(`${result.length} documents successfully inserted in Tech collection.`);
    } catch (err) {
        console.error('Error loading data:', err);
    }
};

type TechStackData = {
    name: string;
    recommended: number;
    components: StackComponents;
    componentsString: string;
    trend: TrendType; // Assuming TREND is an enum or object with keys
    popularity: number;
    languages: string; // Comma-separated string for `languages` (e.g., "lang1,lang2")
    relations: string; // Comma-separated string for `relations` (e.g., "relation1,relation2")
    category: TechStackCategory; // Assuming CATEGORY is an enum or object with keys
    scope: ScopeType;
    description: string;
    useCases: string;
    purpose: string;
    frontEnd: string;
    bestFor: string;
    typicalUseCases: string;
};

export const loadTechStackData = async (fileName: string): Promise<void> => {
    const records: TechStackData[] = [];
    const techs = await TechModel.find({}, {code: 1}).lean();
    const techNamesSet = new Set(techs.map(tech => tech.code));

    try {
        // Step 1: Read and parse the CSV file
        const formatRecord = (record: any): TechStackData => ({
            name: record.Name?.trim(),
            recommended: record.Recommended ? record.Recommended : undefined,
            components: record.Components?.split(',').reduce((acc: StackComponents, item: string) => {
                const techs = item.split('|').map(t => generateTechCode(t.trim()));
                for (const tech of techs) {
                    if (!techNamesSet.has(tech)) {
                        throw new Error(`Tech name ${tech} not found in Tech collection`);
                    }
                }

                techs.length > 1 ? acc.or.push(techs) : acc.and.push(techs[0]);

                return acc;
            }, {and: [], or: []} satisfies StackComponents),
            componentsString: record.Components?.trim(),
            trend: record.Trend.split(/\s+/).map((word: string) => word.charAt(0).toUpperCase()).join(''),
            popularity: record.Popularity ? record.Popularity : undefined,
            languages: record.Languages
                ?.split(',').map(generateTechCode),
            relations: record.Relations
                ?.split(',').map(generateTechCode),
            category: record.Category?.trim(),
            scope: record.Scope?.trim(),
            description: record.Description?.trim(),
            useCases: record.UseCases?.trim(),
            purpose: record.Purpose?.trim(),
            frontEnd: record.FrontEnd?.trim(),
            bestFor: record.BestFor?.trim(),
            typicalUseCases: record.TypicalUseCases?.trim(),
        });

        await new Promise<void>((resolve, reject) => {
            fs.createReadStream(path.resolve(CSV_FILE_PATH, fileName))
                .pipe(csvParser())
                .on('data', (row) => {
                    // Parse and push each CSV record
                    records.push(formatRecord(row));
                })
                .on('end', () => {
                    console.log(`CSV file ${fileName} successfully processed`);
                    resolve();
                })
                .on('error', reject);
        });

        const result = await TechStackModel.insertMany(records);

        console.log(`Tech stack ${result.length} records successfully loaded.`);
    } catch (error) {
        console.error('Error loading tech stack data:', error);
        throw error;
    }
};

const loadData = async () => {
    await dropExistingCollection("tech");
    await dropExistingCollection("techStack");
    await TechModel.init();
    await TechStackModel.init();
    await loadTechData("Tech.csv");
    await loadTechStackData("Stack.csv");
};

// const exportData = async () => {
//     const outputTechNamesFile = path.resolve(process.cwd(), 'src/extraction/extraction/prompt/tech_list');
//     const outputTeckStackFile = path.resolve(process.cwd(), 'src/extraction/extraction/prompt/tech_stack_list');
//     await saveTechNamesToFile(outputTechNamesFile);
//     await saveTechStackNamesToFile(outputTeckStackFile);
// };

(async () => {
    await connected;
    await loadData();
    // await exportData();

    void stopMongoClient();
})();

