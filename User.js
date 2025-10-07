import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }, // 🔹 câmpul corect, nu passwordHash

    isVerified: { type: Boolean, default: false },

    verificationToken: { type: String },
    verificationTokenExpires: { type: Date },

    resetToken: { type: String },
    resetTokenExpires: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
