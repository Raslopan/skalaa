import { NextResponse } from "next/server";
import { getReservations, createReservation, getReservationStats } from "@/lib/queries";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const stats = searchParams.get("stats");
    
    if (stats === "true") {
      const reservationStats = await getReservationStats();
      return NextResponse.json(reservationStats);
    }
    
    const reservations = await getReservations();
    return NextResponse.json(reservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return NextResponse.json(
      { error: "Failed to fetch reservations" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const reservation = await createReservation(data);
    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    console.error("Error creating reservation:", error);
    return NextResponse.json(
      { error: "Failed to create reservation" },
      { status: 500 }
    );
  }
}
