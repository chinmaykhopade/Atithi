import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";
import Hotel from "@/models/Hotel";
import { getTokenFromRequest } from "@/lib/auth";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const payload = await getTokenFromRequest(request);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const review = await Review.findById(id);
    if (!review) return NextResponse.json({ error: "Review not found" }, { status: 404 });

    if (review.userId.toString() !== payload.userId && payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const hotelId = review.hotelId;
    await Review.findByIdAndDelete(id);

    // Recalculate hotel rating
    const reviews = await Review.find({ hotelId });
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
    await Hotel.findByIdAndUpdate(hotelId, {
      rating: Math.round(avgRating * 10) / 10,
      totalReviews: reviews.length,
    });

    return NextResponse.json({ message: "Review deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}