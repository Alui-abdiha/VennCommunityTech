import { Router } from "express";
import {
  listProjects,
  getProjectById,
  createProject,
  updateProject,
  updateProjectStatus,
  deleteProject,
  assignProjectPeople,
  refreshProjectProgress,
  getProjectMembers,
  getAssignableManagers,
  getAssignableMembers,
} from "../controllers/project.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireRole } from "../middleware/requireRole.js";

const router = Router();

router.get("/", requireAuth, listProjects);

router.get(
  "/team/:teamId/assignable-managers",
  requireAuth,
  requireRole("ADMIN", "TEAM_LEADER"),
  getAssignableManagers
);

router.get(
  "/team/:teamId/assignable-members",
  requireAuth,
  requireRole("ADMIN", "TEAM_LEADER", "PROJECT_MANAGER"),
  getAssignableMembers
);

router.get(
  "/:id/members",
  requireAuth,
  requireRole("ADMIN", "TEAM_LEADER", "PROJECT_MANAGER"),
  getProjectMembers
);

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
  requireRole("ADMIN", "TEAM_LEADER", "PROJECT_MANAGER"),
  updateProject
);

router.patch(
  "/:id/status",
  requireAuth,
  requireRole("ADMIN", "TEAM_LEADER", "PROJECT_MANAGER"),
  updateProjectStatus
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

router.patch("/:id/refresh-progress", requireAuth, refreshProjectProgress);

router.delete(
  "/:id",
  requireAuth,
  requireRole("ADMIN", "TEAM_LEADER"),
  deleteProject
);

export default router;