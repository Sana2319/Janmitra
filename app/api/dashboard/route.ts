import { NextResponse } from "next/server";
import connectDB from "@/src/lib/mongoose";
import Feedback from "@/src/models/Feedback";

export async function GET() {
  try {
    await connectDB();

    const feedbacks = await Feedback.find().sort({
      createdAt: -1,
    });

    const total = feedbacks.length;

    const highPriority = feedbacks.filter(
      (f) => f.urgency === "High"
    ).length;

    const pending = feedbacks.filter(
      (f) => f.status === "Pending"
    ).length;

    const resolved = feedbacks.filter(
      (f) => f.status === "Resolved"
    ).length;

    return NextResponse.json({
      total,
      highPriority,
      pending,
      resolved,
      recent: feedbacks.slice(0, 5),
    });

  } catch (err: any) {

    return NextResponse.json(
      {
        error: err.message,
      },
      {
        status: 500,
      }
    );

  }
}
