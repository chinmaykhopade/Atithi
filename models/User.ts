import mongoose, { Schema, models, model } from "mongoose";

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: "customer" | "owner" | "admin";
  phone: string;
  profileImage?: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["customer", "owner", "admin"], default: "customer" },
    phone: { type: String, required: true },
    profileImage: { type: String, default: "" },
  },
  { timestamps: true }
);

const User = models.User || model<IUser>("User", UserSchema);
export default User;