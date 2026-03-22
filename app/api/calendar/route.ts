import { NextResponse } from "next/server";
import { generateCalendarData } from "@/lib/queries";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get("propertyId");
    const year = parseInt(searchParams.get("year") || new Date().getFullYear().toString());
    const month = parseInt(searchParams.get("month") || new Date().getMonth().toString());
    
    if (!propertyId) {
      return NextResponse.json(
        { error: "Property ID is required" },
        { status: 400 }
      );
    }
    
    const calendarData = await generateCalendarData(propertyId, year, month);
    return NextResponse.json(calendarData);
  } catch (error) {
    console.error("Error generating calendar data:", error);
    return NextResponse.json(
      { error: "Failed to generate calendar data" },
      { status: 500 }
    );
  }
}
