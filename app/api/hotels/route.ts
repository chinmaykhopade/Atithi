import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Hotel from "@/models/Hotel";
import { getTokenFromRequest } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const rating = searchParams.get("rating");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "9");
    const ownerId = searchParams.get("ownerId");

    const filter: any = {};

    if (ownerId) {
      filter.ownerId = ownerId;
    }
    // No isApproved filter — all hotels are visible to users

    if (city) filter.city = { $regex: city, $options: "i" };
    if (minPrice) filter.pricePerNight = { ...filter.pricePerNight, $gte: Number(minPrice) };
    if (maxPrice) filter.pricePerNight = { ...filter.pricePerNight, $lte: Number(maxPrice) };
    if (rating) filter.rating = { $gte: Number(rating) };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const total = await Hotel.countDocuments(filter);
    const hotels = await Hotel.find(filter)
      .populate("ownerId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      hotels,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
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

    const hotel = await Hotel.create({
      ...body,
      ownerId: payload.userId,
      isApproved: true, // Auto-approve all hotels; admin can revoke later
    });

    return NextResponse.json({ hotel }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}