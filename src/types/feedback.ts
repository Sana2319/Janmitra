export type Feedback = {
  id: string;
  text: string;
  category: string;
  urgency: "Low" | "Medium" | "High";
  createdAt: string;
};