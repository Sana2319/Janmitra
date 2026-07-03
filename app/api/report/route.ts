import { NextResponse } from "next/server";
import connectDB from "@/src/lib/mongoose";
import Feedback from "@/src/models/Feedback";
import { generateGovernanceReport } from "@/src/services/geminiService";

export async function GET() {
  try {
    await connectDB();

    const feedbacks = await Feedback.find().sort({
      createdAt: -1,
    });

    const report = await generateGovernanceReport(feedbacks);

    return NextResponse.json({
      success: true,
      report,
    });

  } catch (err: any) {

    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      {
        status: 500,
      }
    );

  }
}