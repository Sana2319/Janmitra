import { CommunityPriority } from "../types/community";

export function generatePulse(
  feedbacks: { category: string }[]
): CommunityPriority[] {

  const counts: Record<string, number> = {};

  feedbacks.forEach((feedback) => {
    counts[feedback.category] =
      (counts[feedback.category] || 0) + 1;
  });

  const total = feedbacks.length;

  const priorities: CommunityPriority[] =
    Object.entries(counts).map(
      ([category, count]) => ({
        category,
        count,
        percentage: Math.round(
          (count / total) * 100
        ),
      })
    );

  priorities.sort(
    (a, b) => b.count - a.count
  );

  return priorities;
}