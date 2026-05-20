import { getCaseFromDb } from "./src/lib/cases.ts";
import { generateCaseXai } from "./src/lib/xai.server.ts";

async function main() {
  const caseId = "PCA-2049-0401";
  console.log("Loading case:", caseId);
  const caseData = await getCaseFromDb(caseId);
  
  if (!caseData) {
    console.error("Case not found:", caseId);
    return;
  }
  
  console.log("Found case:", caseData.citizenName);
  
  try {
    const xaiResult = await generateCaseXai(caseData);
    if (!xaiResult) {
      console.log("XAI returned null (possibly missing API key or parse error)");
      return;
    }
    
    console.log("XAI Result:", JSON.stringify(xaiResult, null, 2));
    
    if (xaiResult.summary) {
      console.log("Summary field exists.");
      try {
        const parsedSummary = JSON.parse(xaiResult.summary);
        const keys = [
          'AI-Generate Summary (Bias)',
          'Suspicious Reasoning with Evidence',
          'AI-Generate Summary (non-bias)',
          'Reasoning with Evidence'
        ];
        keys.forEach(key => {
          if (key in parsedSummary) {
            console.log(`Key "${key}" exists in summary.`);
          } else {
            console.log(`Key "${key}" MISSING in summary.`);
          }
        });
      } catch (e) {
        console.error("Summary field is not a valid JSON string:", xaiResult.summary);
      }
    } else {
      console.log("Summary field is MISSING.");
    }
    
  } catch (error) {
    console.error("Error generating XAI:", error);
  }
}

main().catch(console.error);
