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
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
      type: String,
      required: true,
      minlength: [6, 'Password must be at least 8 characters long']
    },
    lastMood: {
      type: String,
      default: "neutral",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
