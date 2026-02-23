import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Room from "@/models/Room";
import Hotel from "@/models/Hotel";
import { getTokenFromRequest } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const hotelId = searchParams.get("hotelId");

    if (!hotelId) {
      return NextResponse.json({ error: "hotelId required" }, { status: 400 });
    }

    const rooms = await Room.find({ hotelId });
    return NextResponse.json({ rooms });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await getTokenFromRequest(request);
    if (!payload || !["owner", "admin"].includes(payload.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    const hotel = await Hotel.findById(body.hotelId);
    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    }

    if (hotel.ownerId.toString() !== payload.userId && payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const room = await Room.create(body);
    return NextResponse.json({ room }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}