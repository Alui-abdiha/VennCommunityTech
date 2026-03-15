import { Router } from "express";
import Team from "../models/Team.js";
import User from "../models/User.js";
import Project from "../models/Project.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireRole } from "../middleware/requireRole.js";

const router = Router();

/**
 * GET ALL TEAMS
 * Returns teams with basic stats
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const teams = await Team.find().sort({ createdAt: -1 });

    const teamsWithStats = await Promise.all(
      teams.map(async (team) => {
        const [membersCount, managersCount, leadersCount, projectsCount] =
          await Promise.all([
            User.countDocuments({
              teamId: team._id,
              role: "MEMBER",
              status: "APPROVED",
            }),
            User.countDocuments({
              teamId: team._id,
              role: "PROJECT_MANAGER",
              status: "APPROVED",
            }),
            User.countDocuments({
              teamId: team._id,
              role: "TEAM_LEADER",
              status: "APPROVED",
            }),
            Project.countDocuments({ teamId: team._id }),
          ]);

        return {
          ...team.toObject(),
          stats: {
            membersCount,
            managersCount,
            leadersCount,
            projectsCount,
          },
        };
      })
    );

    res.json({ ok: true, teams: teamsWithStats });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
});

/**
 * GET ONE TEAM DETAILS
 */
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ ok: false, message: "Team not found" });
    }

    const [members, managers, leaders, projects] = await Promise.all([
      User.find({
        teamId: team._id,
        role: "MEMBER",
        status: "APPROVED",
      }).select("fullName email role"),
      User.find({
        teamId: team._id,
        role: "PROJECT_MANAGER",
        status: "APPROVED",
      }).select("fullName email role"),
      User.find({
        teamId: team._id,
        role: "TEAM_LEADER",
        status: "APPROVED",
      }).select("fullName email role"),
      Project.find({ teamId: team._id })
        .select("name status createdAt")
        .populate("managerId", "fullName")
        .populate("leaderId", "fullName"),
    ]);

    res.json({
      ok: true,
      team,
      stats: {
        membersCount: members.length,
        managersCount: managers.length,
        leadersCount: leaders.length,
        projectsCount: projects.length,
      },
      members,
      managers,
      leaders,
      projects,
    });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
});

/**
 * CREATE TEAM
 */
router.post("/", requireAuth, requireRole("ADMIN"), async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ ok: false, message: "Team name required" });
    }

    const exists = await Team.findOne({ name: name.trim() });
    if (exists) {
      return res.status(400).json({ ok: false, message: "Team already exists" });
    }

    const team = await Team.create({
      name: name.trim(),
      description: description?.trim() || "",
    });

    res.json({ ok: true, team });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
});

/**
 * UPDATE TEAM
 */
router.patch("/:id", requireAuth, requireRole("ADMIN"), async (req, res) => {
  try {
    const { name, description } = req.body;

    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ ok: false, message: "Team not found" });
    }

    if (name?.trim()) {
      const exists = await Team.findOne({
        name: name.trim(),
        _id: { $ne: req.params.id },
      });

      if (exists) {
        return res.status(400).json({
          ok: false,
          message: "Another team already uses this name",
        });
      }

      team.name = name.trim();
    }

    if (description !== undefined) {
      team.description = (description || "").trim();
    }

    await team.save();

    res.json({ ok: true, team });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
});

/**
 * DELETE TEAM
 * Only delete if no users and no projects are linked
 */
router.delete("/:id", requireAuth, requireRole("ADMIN"), async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ ok: false, message: "Team not found" });
    }

    const [usersCount, projectsCount] = await Promise.all([
      User.countDocuments({ teamId: team._id }),
      Project.countDocuments({ teamId: team._id }),
    ]);

    if (usersCount > 0 || projectsCount > 0) {
      return res.status(400).json({
        ok: false,
        message:
          "Cannot delete team with linked users or projects. Remove dependencies first.",
      });
    }

    await Team.findByIdAndDelete(req.params.id);

    res.json({ ok: true, message: "Team deleted successfully" });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
});

/**
 * ASSIGN USER TO TEAM
 */
router.patch(
  "/users/:id/team",
  requireAuth,
  requireRole("ADMIN"),
  async (req, res) => {
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
  }
);

/**
 * GET TEAM MANAGERS
 */
router.get("/:id/managers", requireAuth, async (req, res) => {
  try {
    const managers = await User.find({
      teamId: req.params.id,
      role: "PROJECT_MANAGER",
      status: "APPROVED",
    }).select("fullName email role");

    res.json({ ok: true, managers });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
});

/**
 * GET TEAM MEMBERS
 */
router.get("/:id/members", requireAuth, async (req, res) => {
  try {
    const members = await User.find({
      teamId: req.params.id,
      role: "MEMBER",
      status: "APPROVED",
    }).select("fullName email role");

    res.json({ ok: true, members });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
});

export default router;