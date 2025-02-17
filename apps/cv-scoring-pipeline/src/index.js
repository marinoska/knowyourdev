"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var openai_1 = require("@langchain/openai");
var prompts_1 = require("@langchain/core/prompts");
var runnables_1 = require("@langchain/core/runnables");
var pdf_1 = require("@langchain/community/document_loaders/fs/pdf");
var dotenv = require("dotenv");
dotenv.config();
// Initialize OpenAI model
var model = new openai_1.OpenAI({
    model: "gpt-4o-mini",
    temperature: 0.2,
    openAIApiKey: process.env.OPENAI_API_KEY,
});
// Function to extract text from a CV (PDF)
function extractCVText(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var loader, docs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loader = new pdf_1.PDFLoader(filePath);
                    return [4 /*yield*/, loader.load()];
                case 1:
                    docs = _a.sent();
                    return [2 /*return*/, docs.map(function (doc) { return doc.pageContent; }).join(" ")];
            }
        });
    });
}
// Scoring Rule 2: Extract Tech Stack
var techStackPrompt = prompts_1.ChatPromptTemplate.fromTemplate("\nEvaluate this developer's CV strictly based on technical depth, experience consistency, and execution ability. Ignore all mentions of soft skills like \"good problem solver\" or \"team player\"\u2014these should only be evaluated in interviews.\n\nKey evaluation principles:\n\u2705 Does the developer have the **technical ability to build an MVP or work autonomously on complex tasks**?\n\u2705 Are there **inconsistencies** in their experience that indicate a lack of real expertise?\n\u2705 Has the developer demonstrated **execution and ownership of major projects**?\n\u2705 Is the **CV well-structured and easy to understand**?\n\nAnalyze the CV and return structured JSON:\n{\n  \"MVP_Readiness_Score\": X/10,\n  \"Execution_Ability\": \"High / Medium / Low\",\n  \"Consistency_Check\": \"Consistent / Mixed / Inconsistent\",\n  \"Detected_Issues\": [\"...\"]\n}\n");
// Use RunnableSequence instead of LLMChain
var techStackChain = runnables_1.RunnableSequence.from([
    techStackPrompt,
    model,
]);
function analyzeCV(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var cvText, techStackResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, extractCVText(filePath)];
                case 1:
                    cvText = _a.sent();
                    return [4 /*yield*/, techStackChain.invoke({ cv_text: cvText })];
                case 2:
                    techStackResult = _a.sent();
                    console.log("Extracted Tech Stack:", techStackResult);
                    return [2 /*return*/, {
                            techStack: JSON.parse(techStackResult),
                            // Additional analysis (SR3-SR8) can be added here
                        }];
            }
        });
    });
}
// Example usage
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, analyzeCV("./cv/cv.pdf")];
            case 1:
                result = _a.sent();
                console.log("Final Evaluation:", result);
                return [2 /*return*/];
        }
    });
}); })();
