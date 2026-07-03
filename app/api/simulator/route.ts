import { NextRequest, NextResponse } from "next/server";
import { generateVillageEvent } from "@/src/services/geminiService";

export async function POST(req: NextRequest) {

  try {

    const metrics = await req.json();

    const event = await generateVillageEvent(metrics);

    return NextResponse.json({
      success: true,
      event,
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