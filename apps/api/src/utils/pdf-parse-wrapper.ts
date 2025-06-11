// This is a wrapper for the pdf-parse module that fixes the debug mode detection issue
// Import the actual PDF parsing functionality directly from the internal module,
// bypassing the main index.js file that contains the debug mode check
// https://gitlab.com/autokent/pdf-parse/-/issues/24

// @ts-ignore
import pdfParse from "pdf-parse/lib/pdf-parse.js";

// Export the module directly
export default pdfParse;
