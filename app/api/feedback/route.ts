import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/src/lib/mongoose";
import Feedback from "@/src/models/Feedback";
import { categorizeFeedback } from "@/src/ai/categorizeFeedbacks";
import { analyzeComplaint } from "@/src/services/geminiService";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

const ruleAI = categorizeFeedback(body.message);

let gemini = null;

try {
  gemini = await analyzeComplaint(body.message, body.language || "English");
} catch (err) {
  console.log("Gemini unavailable, using rule AI");
}

    const feedback = await Feedback.create({

  ...body,

  summary:
    gemini?.summary ??
    body.message,

  category:
    gemini?.category ??
    ruleAI.category,

  urgency:
    gemini?.urgency ??
    ruleAI.urgency,

  sentiment:
    gemini?.sentiment ??
    "Neutral",

  department:
    gemini?.department ??
    "Other",

  recommendedAction:
    gemini?.recommendedAction ??
    "",

  keywords:
    ruleAI.keywords,

  aiConfidence:
    gemini ? 0.95 : ruleAI.confidence,

});



    return NextResponse.json(
      {
        success: true,
        feedback,
      },
      {
        status: 201,
      }
    );
  } catch (err: any) {
    console.error(err);

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

export async function GET() {

  try {

    await connectDB();

    const feedbacks = await Feedback
      .find()
      .sort({
        createdAt: -1
      });

    return NextResponse.json(
      {
        success: true,
        feedbacks,
      },
      {
        status: 200,
      }
    );

  } catch (err: any) {

    console.error(err);

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

export async function PATCH(req: NextRequest) {

  try {

    await connectDB();

    const body = await req.json();

    const updated = await Feedback.findByIdAndUpdate(

      body.id,

      {
        status: body.status,
      },

      {
        new: true,
      }

    );

    return NextResponse.json({

      success: true,

      feedback: updated,

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