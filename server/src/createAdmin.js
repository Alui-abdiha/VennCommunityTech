import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";

dotenv.config();
await connectDB(process.env.MONGO_URI);

const email = "admin@Venn.com";
const password = "admin123";
const fullName = "Venn Admin";

const passwordHash = await bcrypt.hash(password, 10);

const admin = await User.findOne({ email });

if (admin) {
  admin.fullName = fullName;
  admin.passwordHash = passwordHash; // ✅ reset password
  admin.role = "ADMIN";
  admin.status = "APPROVED";
  await admin.save();

  console.log("Admin updated ✅", { email, password });
  process.exit(0);
}

await User.create({
  fullName,
  email,
  passwordHash,
  role: "ADMIN",
  status: "APPROVED",
});

console.log("Admin created ✅", { email, password });
process.exit(0);