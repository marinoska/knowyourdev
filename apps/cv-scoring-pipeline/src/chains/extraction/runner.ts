import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { extractCVData } from "@/chains/extraction/CVData/extractCVData.chain.js";
import { TechModel } from "@/models/tech.model.js";
import { ExtractedCVData } from "@/models/types.js";
import { hash } from "@/utils/crypto.js";
import { pipe } from "@/utils/func.js";
import { ExtractionChainParam, TechNamesMap } from "@/chains/extraction/types.js";
import { extractTechnologies } from "@/chains/extraction/techs/extractTechnologies.chain.js";

async function extractCVText(filePath: string): Promise<string> {
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();
    return docs.map(doc => doc.pageContent).join(" ");
}

export async function runCVDataExtraction(filePath: string): Promise<{
    hash: string;
} & ExtractedCVData> {
    const cvText = await extractCVText(filePath);

    if (!cvText || cvText.trim() === "") {
        throw new Error("CV text extraction failed. Please check the PDF file.");
    }

    const techDocList = await TechModel.find({}, {name: 1, code: 1}).lean();
    // const referenceTechList = techDocList.map(({name}) => name);
    const techNamesMap: TechNamesMap = techDocList.reduce((acc, {name, code}) =>
        ({...acc, [code]: name}), {});

    const inputData: ExtractionChainParam = {
        cvText,
        techNamesMap,
        techNamesString: Object.values(techNamesMap).join(',')
    };
    const output = await pipe<ExtractionChainParam>(
        inputData,
        extractCVData,
        extractTechnologies
    );
    // type narrowing here
    if (!("extractedData" in output)) {
        throw new Error("extractedData cannot be empty");
    }

    return {...output.extractedData, hash: hash(cvText)};
}
