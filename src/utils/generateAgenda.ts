import { Feedback } from "../types/feedback";
import { AgendaItem } from "../types/agenda";

const agendaTemplates: Record<
  string,
  {
    title: string;
    description: string;
  }
> = {
  Water: {
    title: "Improve Drinking Water Access",
    description:
      "Citizens reported recurring water shortages. Discuss pipeline maintenance, pump repairs, and water distribution improvements.",
  },

  Roads: {
    title: "Road Repair and Maintenance",
    description:
      "Residents highlighted damaged roads and potholes. Review repair budgets and prioritize critical routes.",
  },

  Drainage: {
    title: "Upgrade Drainage Infrastructure",
    description:
      "Flooding and drainage concerns were raised. Evaluate drainage capacity and identify vulnerable locations.",
  },

  Healthcare: {
    title: "Strengthen Local Healthcare Services",
    description:
      "Citizens requested improved healthcare access. Review staffing, facilities, and medical resource availability.",
  },

  Education: {
    title: "Improve Educational Facilities",
    description:
      "Residents highlighted issues related to schools and learning infrastructure. Discuss maintenance and educational support programs.",
  },

  Other: {
    title: "Community Development Review",
    description:
      "Review citizen concerns and identify additional development priorities.",
  },
};

export function generateAgenda(
  feedbacks: Feedback[]
): AgendaItem[] {

  const categories: Record<
  string,
  {
    count: number;
    examples: string[];
  }
> = {};

  feedbacks.forEach((feedback) => {

  if (!categories[feedback.category]) {
    categories[feedback.category] = {
      count: 0,
      examples: [],
    };
  }

  categories[feedback.category].count++;

  if (
    categories[feedback.category].examples.length < 3
  ) {
    categories[feedback.category].examples.push(
      feedback.text
    );
  }
});

  return Object.entries(categories)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)
    .map(([category, data]) => ({

  title:
    category === "Water"
      ? "Critical Drinking Water Issues"
      : category === "Roads"
      ? "Road Repair & Safety Concerns"
      : category === "Education"
      ? "School Infrastructure Problems"
      : category === "Healthcare"
      ? "Healthcare Service Deficiencies"
      : category === "Drainage"
      ? "Drainage & Flooding Concerns"
      : `${category} Issues`,

  priority:
  data.count >= 4
    ? "High"
    : data.count >= 2
    ? "Medium"
    : "Low",

  reports: data.count,

  examples: data.examples,

  description:
    `${data.count} citizen reports require attention in this area.`,

  recommendation:
  category === "Water"
    ? "Increase investment in water infrastructure and repair existing supply systems."
    : category === "Roads"
    ? "Prioritize pothole repairs and improve road safety measures."
    : category === "Healthcare"
    ? "Allocate resources toward staffing and healthcare accessibility."
    : category === "Education"
    ? "Repair school facilities and improve educational infrastructure."
    : category === "Drainage"
    ? "Upgrade drainage networks before monsoon season."
    : "Review citizen concerns and develop targeted action plans.",

}));
}