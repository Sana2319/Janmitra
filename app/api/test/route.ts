import { NextResponse } from "next/server";
import clientPromise from "@/src/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;

    const db = client.db(process.env.MONGODB_DB);

    await db.command({ ping: 1 });

    return NextResponse.json({
      success: true,
      message: "Successfully connected to MongoDB!",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "MongoDB connection failed",
      },
      {
        status: 500,
      }
    );
  }
}