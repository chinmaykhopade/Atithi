import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword, generateToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { name, email, password, phone, role } = await request.json();

    if (!name || !email || !password || !phone) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: role || "customer",
    });

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    };

    const response = NextResponse.json({ user: userResponse, token }, { status: 201 });
    response.cookies.set("token", token, {
      httpOnly: false,
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}