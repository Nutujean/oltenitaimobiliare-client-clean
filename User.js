import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Numele este obligatoriu"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Emailul este obligatoriu"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Parola este obligatorie"],
    },

    // confirmare cont
    isVerified: { type: Boolean, default: false },

    // token pentru verificare email
    verificationToken: { type: String },
    verificationTokenExpires: { type: Date },

    // resetare parolă
    resetToken: { type: String },
    resetTokenExpires: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
