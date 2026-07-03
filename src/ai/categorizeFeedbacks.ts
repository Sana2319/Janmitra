export type AIResult = {
  category: string;
  urgency: "Low" | "Medium" | "High";
  sentiment: "Positive" | "Neutral" | "Negative";
  keywords: string[];
  confidence: number;
};

const CATEGORY_KEYWORDS = {
  Water: [
    "water",
    "drinking",
    "tap",
    "pipeline",
    "handpump",
    "pump",
    "borewell",
    "tank",
    "water supply"
  ],

  Roads: [
    "road",
    "roads",
    "street",
    "pothole",
    "bridge",
    "highway",
    "footpath"
  ],

  Drainage: [
    "drain",
    "drainage",
    "sewage",
    "sewer",
    "overflow",
    "garbage",
    "waste"
  ],

  Electricity: [
    "electricity",
    "electric",
    "power",
    "transformer",
    "wire",
    "street light",
    "blackout"
  ],

  Education: [
    "school",
    "teacher",
    "college",
    "classroom",
    "education",
    "student"
  ],

  Healthcare: [
    "hospital",
    "clinic",
    "doctor",
    "medicine",
    "health",
    "ambulance"
  ],

  Safety: [
    "crime",
    "theft",
    "harassment",
    "violence",
    "accident",
    "unsafe"
  ]
};

const HIGH_WORDS = [
  "collapse",
  "collapsed",
  "collapsing",
  "broken",
  "danger",
  "dangerous",
  "accident",
  "injury",
  "death",
  "dead",
  "emergency",
  "critical",
  "fire",
  "flood",
  "overflow",
  "sewage",
  "dirty",
  "contaminated",
  "infected",
  "no water",
  "not working",
  "huge",
  "crack",
  "falling"
];

const MEDIUM_WORDS = [
  "repair",
  "damaged",
  "issue",
  "problem",
  "delay",
  "bad",
  "poor",
  "garbage",
  "waste",
  "leak",
  "blocked"
];

const LOW_WORDS = [
  "request",
  "suggestion",
  "plant",
  "park",
  "paint",
  "beautify"
];

function extractKeywords(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(word => word.length > 3);
}

export function categorizeFeedback(text: string): AIResult {

  const lower = text.toLowerCase();

  let category = "Other";

  let score = 0;

  for (const [cat, words] of Object.entries(CATEGORY_KEYWORDS)) {

    if (words.some(word => lower.includes(word))) {

      category = cat;

      score += 30;

      break;
    }
  }

  HIGH_WORDS.forEach(word => {
    if (lower.includes(word)) score += 30;
  });

  MEDIUM_WORDS.forEach(word => {
    if (lower.includes(word)) score += 15;
  });

  LOW_WORDS.forEach(word => {
    if (lower.includes(word)) score -= 10;
  });

  if (
    lower.includes("school") &&
    (
      lower.includes("collapse") ||
      lower.includes("collapsing") ||
      lower.includes("roof")
    )
  ) {
    score += 40;
  }

  if (
    lower.includes("water") &&
    (
      lower.includes("dirty") ||
      lower.includes("contaminated") ||
      lower.includes("drinking")
    )
  ) {
    score += 35;
  }

  if (
    lower.includes("road") &&
    (
      lower.includes("accident") ||
      lower.includes("pothole")
    )
  ) {
    score += 30;
  }

  let urgency: "Low" | "Medium" | "High";

  if (score >= 80)
    urgency = "High";
  else if (score >= 40)
    urgency = "Medium";
  else
    urgency = "Low";

  let sentiment: "Positive" | "Neutral" | "Negative";

  if (score >= 40)
    sentiment = "Negative";
  else
    sentiment = "Neutral";

  return {

    category,

    urgency,

    sentiment,

    keywords: extractKeywords(text),

    confidence: Math.min(score,100)/100

  };

}