import { Feedback } from "../types/feedback";
import { mockFeedback } from "../data/mockFeedback";

const STORAGE_KEY = "janmitra_feedback";

export function getFeedbacks(): Feedback[] {

  if (typeof window === "undefined") {
    return mockFeedback;
  }

  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(mockFeedback)
    );

    return mockFeedback;
  }

  return JSON.parse(stored);
}

export function addFeedback(
  feedback: Feedback
) {

  const feedbacks = getFeedbacks();

  feedbacks.push(feedback);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(feedbacks)
  );
}