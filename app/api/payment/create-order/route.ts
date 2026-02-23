import { NextResponse } from "next/server";
import { razorpayInstance } from "@/lib/razorpay";
import { getTokenFromRequest } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const payload = await getTokenFromRequest(request);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { amount, bookingId } = await request.json();

    const options = {
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: `booking_${bookingId}`,
      notes: {
        bookingId,
        userId: payload.userId,
      },
    };

    const order = await razorpayInstance.orders.create(options);
    return NextResponse.json({ order });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}