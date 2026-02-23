import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";
import Hotel from "@/models/Hotel";
import { getTokenFromRequest } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const hotelId = searchParams.get("hotelId");

    const filter: any = {};
    if (hotelId) filter.hotelId = hotelId;

    const reviews = await Review.find(filter)
      .populate("userId", "name profileImage")
      .sort({ createdAt: -1 });

    return NextResponse.json({ reviews });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await getTokenFromRequest(request);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await request.json();

    const existingReview = await Review.findOne({
      userId: payload.userId,
      hotelId: body.hotelId,
    });
    if (existingReview) {
      return NextResponse.json({ error: "You already reviewed this hotel" }, { status: 400 });
    }

    const review = await Review.create({
      ...body,
      userId: payload.userId,
    });

    // Update hotel rating
    const reviews = await Review.find({ hotelId: body.hotelId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Hotel.findByIdAndUpdate(body.hotelId, {
      rating: Math.round(avgRating * 10) / 10,
      totalReviews: reviews.length,
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}