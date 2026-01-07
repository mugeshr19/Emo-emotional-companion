import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    lastMood: {
      type: String,
      default: "neutral",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
