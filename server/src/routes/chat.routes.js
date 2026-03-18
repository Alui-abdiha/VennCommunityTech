import { Router } from "express";
import ChatMessage from "../models/ChatMessage.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

/**
 * Who can access what:
 * GENERAL -> all approved logged-in users
 * LEADERS -> ADMIN + TEAM_LEADER only
 * TEAM -> any approved logged-in user with same teamId
 */

function canAccessScope(user, scope) {
  if (scope === "GENERAL") return true;

  if (scope === "LEADERS") {
    return user.role === "ADMIN" || user.role === "TEAM_LEADER";
  }

  if (scope === "TEAM") {
    return !!user.teamId;
  }

  return false;
}

router.get("/", requireAuth, async (req, res) => {
  try {
    const { scope = "GENERAL" } = req.query;

    if (!["GENERAL", "LEADERS", "TEAM"].includes(scope)) {
      return res.status(400).json({ ok: false, message: "Invalid chat scope" });
    }

    if (!canAccessScope(req.user, scope)) {
      return res.status(403).json({ ok: false, message: "Forbidden" });
    }

    const query = { scope };

    if (scope === "TEAM") {
      query.teamId = req.user.teamId;
    }

    const messages = await ChatMessage.find(query)
      .sort({ createdAt: 1 })
      .limit(200)
      .populate("senderId", "fullName role teamId")
      .populate("teamId", "name");

    res.json({ ok: true, messages });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const { scope, text } = req.body;

    if (!scope || !text?.trim()) {
      return res.status(400).json({
        ok: false,
        message: "scope and text are required",
      });
    }

    if (!["GENERAL", "LEADERS", "TEAM"].includes(scope)) {
      return res.status(400).json({ ok: false, message: "Invalid chat scope" });
    }

    if (!canAccessScope(req.user, scope)) {
      return res.status(403).json({ ok: false, message: "Forbidden" });
    }

    const payload = {
      scope,
      text: text.trim(),
      senderId: req.user._id,
      teamId: scope === "TEAM" ? req.user.teamId : null,
    };

    if (scope === "TEAM" && !req.user.teamId) {
      return res.status(400).json({
        ok: false,
        message: "You must belong to a team for team chat",
      });
    }

    const message = await ChatMessage.create(payload);

    const populated = await ChatMessage.findById(message._id)
      .populate("senderId", "fullName role teamId")
      .populate("teamId", "name");

    res.json({ ok: true, message: populated });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const message = await ChatMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ ok: false, message: "Message not found" });
    }

    const isOwner = String(message.senderId) === String(req.user._id);
    const isAdmin = req.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ ok: false, message: "Forbidden" });
    }

    await message.deleteOne();

    res.json({ ok: true, message: "Message deleted" });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
});

export default router;