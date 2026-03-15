import { Router } from "express";
import User from "../models/User.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireRole } from "../middleware/requireRole.js";

const router = Router();

router.get(
  "/team-members",
  requireAuth,
  requireRole("ADMIN", "TEAM_LEADER", "PROJECT_MANAGER"),
  async (req, res) => {
    try {
      let query = {
        role: "MEMBER",
        status: "APPROVED",
      };

      if (req.user.role !== "ADMIN") {
        query.teamId = req.user.teamId;
      }

      const users = await User.find(query)
        .select("fullName email role teamId")
        .populate("teamId", "name")
        .sort({ createdAt: -1 });

      res.json({ ok: true, users });
    } catch (e) {
      res.status(500).json({ ok: false, message: e.message });
    }
  }
);

export default router;