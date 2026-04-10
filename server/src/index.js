import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";
import leaderboardRoutes from "./routes/leaderboard.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import statsRoutes from "./routes/statsRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import milestoneRoutes from "./routes/milestone.routes.js";
import chatRoutes from "./routes/chat.routes.js";

import { connectDB } from "./config/db.js";
import { notFound, errorHandler } from "./middleware/error.middleware.js";

dotenv.config();

const app = express();


// ✅ Allowed domains (IMPORTANT)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://main.d303qnsvqd2uym.amplifyapp.com",
  "https://venncommunitytech.org",
  "https://www.venncommunitytech.org"
];


// ✅ CORS configuration (FIXED)
app.use(cors({
  origin: function (origin, callback) {
    console.log("Incoming Origin:", origin);
    // allow requests with no origin (like curl or mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS blocked for origin: " + origin));
    }
  },
  credentials: true
}));
// ✅ Middleware
app.use(express.json());


// ✅ Routes
app.get("/", (req, res) => {
  res.send("Venn Tech Co Server Running ✅");
});

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/users", userRoutes);
app.use("/api/milestones", milestoneRoutes);
app.use("/api/chat", chatRoutes);

// ✅ Error handlers
app.use(notFound);
app.use(errorHandler);


// ✅ Start server
const port = process.env.PORT || 5000;

await connectDB(process.env.MONGO_URI);

app.listen(port, () => {
  console.log(`🚀 API running on http://localhost:${port}`);
});
