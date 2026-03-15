import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },

    role: {
      type: String,
      enum: ["ADMIN", "TEAM_LEADER", "PROJECT_MANAGER", "MEMBER"],
      default: "MEMBER",
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "DENIED"],
      default: "PENDING",
    },

    teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team", default: null },

    points: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);