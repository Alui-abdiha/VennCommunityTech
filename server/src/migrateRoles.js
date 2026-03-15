import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";

dotenv.config();
await connectDB(process.env.MONGO_URI);

const res = await User.updateMany(
  { role: "MANAGER" },
  { $set: { role: "PROJECT_MANAGER" } }
);

console.log("Updated roles ✅", res);
process.exit(0);