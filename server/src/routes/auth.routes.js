import { Router } from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { signToken } from "../utils/token.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) return res.status(400).json({ ok: false, message: "fullName, email, password required" });
  if (password.length < 6) return res.status(400).json({ ok: false, message: "Password must be at least 6 characters" });

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return res.status(409).json({ ok: false, message: "Email already used" });

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName,
    email: email.toLowerCase(),
    passwordHash,
    status: "PENDING",
    role: "MEMBER"
  });

  res.json({
    ok: true,
    message: "Registered. Waiting for admin approval.",
    user: { id: user._id, fullName: user.fullName, email: user.email, status: user.status }
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ ok: false, message: "email, password required" });

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(401).json({ ok: false, message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ ok: false, message: "Invalid credentials" });

  if (user.status !== "APPROVED") return res.status(403).json({ ok: false, message: `Account is ${user.status}. Admin approval required.` });

  const token = signToken(user);
  res.json({
    ok: true,
    token,
    user: { id: user._id, fullName: user.fullName, email: user.email, 
      role: user.role, status: user.status, points: user.points, teamId: user.teamId }
  });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ ok: true, user: req.user });
});

export default router;