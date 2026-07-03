import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export async function analyzeComplaint(
  message: string,
  language: string = "English"
) {
  const prompt = `
You are an AI assistant for an Indian village governance platform (JanMitra).

Analyze this citizen complaint.

Complaint:
"${message}"

Selected Language: "${language}"

Return ONLY valid JSON in this format:
{
 "summary": "",
 "category": "",
 "urgency": "",
 "department": "",
 "sentiment": "",
 "recommendedAction": ""
}

Rules:
1. "summary" must be a concise summary of the complaint (under 20 words), written in the citizen's Selected Language ("${language}").
2. "recommendedAction" must be a specific suggested corrective action, written in the citizen's Selected Language ("${language}").
3. "category" must be exactly one of these:
   - Water
   - Roads
   - Education
   - Healthcare
   - Electricity
   - Sanitation
   - Agriculture
   - Other
4. "urgency" must be exactly one of these:
   - Low
   - Medium
   - High
5. "department" must be exactly one of these:
   - Public Works
   - Panchayat
   - Water Department
   - Health Department
   - Education Department
   - Electricity Board
   - Other
6. "sentiment" must be exactly one of:
   - Positive
   - Neutral
   - Negative

Return ONLY JSON. Do not write any explanations before or after the JSON.
`;

  const result = await model.generateContent(prompt);

  const text = result.response
  .text()
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

return JSON.parse(text);
}

export async function generateGovernanceReport(
  feedbacks: any[]
) {

  const prompt = `
You are an AI governance advisor for an Indian Gram Panchayat.

Below is a list of citizen complaints.

${JSON.stringify(feedbacks)}

Generate a professional governance report.

Return ONLY valid JSON.

{
  "executiveSummary":"",
  "topIssues":[
    "",
    "",
    ""
  ],
  "budgetRecommendation":"",
  "agendaRecommendation":"",
  "departmentActions":[
    "",
    "",
    ""
  ],
  "villageHealthScore":0
}

Rules:

- Executive summary should be under 100 words.
- Top issues should contain only the 3 biggest problems.
- Budget recommendation should explain where maximum funds should be allocated.
- Agenda recommendation should suggest priorities for the next Gram Sabha.
- Department actions should be specific and actionable.
- VillageHealthScore must be an integer between 0 and 100.
`;

  const result = await model.generateContent(prompt);

  const text = result.response
  .text()
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

return JSON.parse(text);

}

export async function generateVillageEvent(
  metrics: {
    water: number;
    roads: number;
    education: number;
    drainage: number;
  }
) {

  const prompt = `
You are an AI advisor for a Gram Panchayat.

Current village condition:

Water: ${metrics.water}
Roads: ${metrics.roads}
Education: ${metrics.education}
Drainage: ${metrics.drainage}

Generate ONE realistic village event.

Return ONLY valid JSON.

{
"title":"",
"description":"",
"impact":{
"water":0,
"roads":0,
"education":0,
"drainage":0
}
}

Rules:

- Impact values must be between -10 and +10.
- Make the event realistic.
- Examples:
Heavy rainfall,
Water pipeline burst,
School roof collapse,
Disease outbreak,
Road accident,
Government grant received,
New irrigation project.

Return ONLY JSON.
`;

  const result = await model.generateContent(prompt);

  const text = result.response
    .text()
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(text);

}