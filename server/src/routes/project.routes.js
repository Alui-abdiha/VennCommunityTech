import { Router } from "express";
import {
  listProjects,
  getProjectById,
  createProject,
  updateProject,
  updateProjectStatus,
  deleteProject,
  assignProjectPeople,
} from "../controllers/project.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireRole } from "../middleware/requireRole.js";
import User from "../models/User.js";
import Project from "../models/Project.js";

const router = Router();

router.get("/", requireAuth, listProjects);
router.get("/:id", requireAuth, getProjectById);

router.post(
  "/",
  requireAuth,
  requireRole("ADMIN", "TEAM_LEADER"),
  createProject
);

router.patch(
  "/:id",
  requireAuth,
  requireRole("ADMIN", "TEAM_LEADER"),
  updateProject
);

router.patch(
  "/:id/status",
  requireAuth,
  requireRole("ADMIN", "TEAM_LEADER"),
  updateProjectStatus
);

router.delete(
  "/:id",
  requireAuth,
  requireRole("ADMIN", "TEAM_LEADER"),
  deleteProject
);

router.patch(
  "/:id/assign",
  requireAuth,
  requireRole("ADMIN", "TEAM_LEADER", "PROJECT_MANAGER"),
  assignProjectPeople
);

router.patch(
  "/:id/members",
  requireAuth,
  requireRole("ADMIN", "TEAM_LEADER", "PROJECT_MANAGER"),
  assignProjectPeople
);

router.get(
  "/team/:teamId/assignable-managers",
  requireAuth,
  requireRole("ADMIN", "TEAM_LEADER"),
  async (req, res) => {
    try {
      const users = await User.find({
        teamId: req.params.teamId,
        role: "PROJECT_MANAGER",
        status: "APPROVED",
      }).select("fullName email role teamId");

      res.json({ ok: true, users });
    } catch (e) {
      res.status(500).json({ ok: false, message: e.message });
    }
  }
);

router.get(
  "/team/:teamId/assignable-members",
  requireAuth,
  requireRole("ADMIN", "TEAM_LEADER", "PROJECT_MANAGER"),
  async (req, res) => {
    try {
      const users = await User.find({
        teamId: req.params.teamId,
        role: "MEMBER",
        status: "APPROVED",
      }).select("fullName email role teamId");

      res.json({ ok: true, users });
    } catch (e) {
      res.status(500).json({ ok: false, message: e.message });
    }
  }
);

router.get(
  "/:id/members",
  requireAuth,
  requireRole("ADMIN", "PROJECT_MANAGER", "TEAM_LEADER"),
  async (req, res) => {
    try {
      const project = await Project.findById(req.params.id).populate(
        "members",
        "fullName email role teamId"
      );

      if (!project) {
        return res.status(404).json({ ok: false, message: "Project not found" });
      }

      if (
        req.user.role === "PROJECT_MANAGER" &&
        String(project.managerId) !== String(req.user._id)
      ) {
        return res.status(403).json({ ok: false, message: "Forbidden" });
      }

      if (
        req.user.role === "TEAM_LEADER" &&
        String(project.leaderId) !== String(req.user._id)
      ) {
        return res.status(403).json({ ok: false, message: "Forbidden" });
      }

      res.json({ ok: true, members: project.members || [] });
    } catch (e) {
      res.status(500).json({ ok: false, message: e.message });
    }
  }
);

export default router;