import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import User from "../models/User.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  const users = await User.find({ status: "APPROVED" })
    .sort({ points: -1 })
    .select("fullName email role points");

  res.json({ ok: true, users });
});

export default router;