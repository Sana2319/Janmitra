import { Feedback } from "../types/feedback";

export function generateBudget(
  feedbacks: Feedback[]
) {
  const counts: Record<string, number> = {};

  feedbacks.forEach((feedback) => {
    counts[feedback.category] =
      (counts[feedback.category] || 0) + 1;
  });

  const totalReports =
    Object.values(counts).reduce(
      (sum, value) => sum + value,
      0
    );

  return Object.entries(counts).map(
    ([category, count]) => ({
      category,
      reports: count,
      allocation: Math.round(
        (count / totalReports) * 100
      ),
    })
  );
}