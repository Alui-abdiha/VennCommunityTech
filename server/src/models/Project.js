import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },

    status: {
      type: String,
      enum: ["PLANNING", "ACTIVE", "ON_HOLD", "DONE"],
      default: "ACTIVE",
    },

    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      default: "MEDIUM",
    },

    clientName: { type: String, default: "", trim: true },

    startDate: { type: Date, default: null },
    dueDate: { type: Date, default: null },

    githubUrl: { type: String, default: "", trim: true },
    liveUrl: { type: String, default: "", trim: true },
    docsUrl: { type: String, default: "", trim: true },
    figmaUrl: { type: String, default: "", trim: true },
    chatUrl: { type: String, default: "", trim: true },
    driveUrl: { type: String, default: "", trim: true },

    tags: [{ type: String, trim: true }],
    notes: { type: String, default: "" },
    lastUpdate: { type: String, default: "" },

    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },

    leaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);