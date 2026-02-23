import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Hotel from "@/models/Hotel";
import Room from "@/models/Room";
import Review from "@/models/Review";
import { getTokenFromRequest } from "@/lib/auth";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    const hotel = await Hotel.findById(id).populate("ownerId", "name email phone");
    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    }

    const rooms = await Room.find({ hotelId: id });
    const reviews = await Review.find({ hotelId: id })
      .populate("userId", "name profileImage")
      .sort({ createdAt: -1 });

    return NextResponse.json({ hotel, rooms, reviews });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const payload = await getTokenFromRequest(request);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const hotel = await Hotel.findById(id);

    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    }

    if (hotel.ownerId.toString() !== payload.userId && payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await Hotel.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json({ hotel: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const payload = await getTokenFromRequest(request);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const hotel = await Hotel.findById(id);

    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    }

    if (hotel.ownerId.toString() !== payload.userId && payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Room.deleteMany({ hotelId: id });
    await Review.deleteMany({ hotelId: id });
    await Hotel.findByIdAndDelete(id);

    return NextResponse.json({ message: "Hotel deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}