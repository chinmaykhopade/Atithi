import { NextResponse } from "next/server";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { getTokenFromRequest } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const payload = await getTokenFromRequest(request);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } =
      await request.json();

    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      await connectDB();
      await Booking.findByIdAndUpdate(bookingId, { paymentStatus: "failed" });
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    await connectDB();
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        paymentStatus: "paid",
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
      },
      { new: true }
    );

    return NextResponse.json({ booking, message: "Payment verified" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}