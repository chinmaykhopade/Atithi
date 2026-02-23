import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { getTokenFromRequest } from "@/lib/auth";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const payload = await getTokenFromRequest(request);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const booking = await Booking.findById(id)
      .populate("hotelId")
      .populate("roomId")
      .populate("userId", "name email phone");

    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    return NextResponse.json({ booking });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const payload = await getTokenFromRequest(request);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await request.json();
    const booking = await Booking.findByIdAndUpdate(id, body, { new: true });

    return NextResponse.json({ booking });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}