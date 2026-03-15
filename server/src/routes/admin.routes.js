import { Router } from "express";
import User from "../models/User.js";
import Team from "../models/Team.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireRole } from "../middleware/requireRole.js";

const router = Router();

// All admin routes require ADMIN
router.use(requireAuth, requireRole("ADMIN"));

// GET pending users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find()
      .populate("teamId", "name")
      .sort({ createdAt: -1 })
      .select("fullName email role status teamId createdAt");

    res.json({ ok: true, users });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
});

// PATCH approve/deny
router.patch("/users/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["APPROVED", "DENIED", "PENDING"].includes(status)) {
      return res.status(400).json({ ok: false, message: "Invalid status" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("teamId", "name");

    if (!user) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }

    res.json({ ok: true, user });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
});

// PATCH role
router.patch("/users/:id/role", async (req, res) => {
  try {
    const { role } = req.body;

    if (!["ADMIN", "TEAM_LEADER", "PROJECT_MANAGER", "MEMBER"].includes(role)) {
      return res.status(400).json({ ok: false, message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).populate("teamId", "name");

    if (!user) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }

    res.json({ ok: true, user });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
});

// PATCH assign team
router.patch("/users/:id/team", async (req, res) => {
  try {
    const { teamId } = req.body;

    if (teamId) {
      const team = await Team.findById(teamId);
      if (!team) {
        return res.status(404).json({ ok: false, message: "Team not found" });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { teamId: teamId || null },
      { new: true }
    ).populate("teamId", "name");

    if (!user) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }

    res.json({ ok: true, user });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
});

export default router;