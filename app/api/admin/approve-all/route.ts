import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Hotel from "@/models/Hotel";

// One-time migration: approve all existing hotels
// Call: GET /api/admin/approve-all
export async function GET() {
    try {
        await connectDB();
        const result = await Hotel.updateMany(
            { isApproved: false },
            { $set: { isApproved: true } }
        );
        return NextResponse.json({
            message: `✅ Approved ${result.modifiedCount} hotels.`,
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
