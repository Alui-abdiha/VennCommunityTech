import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireRole } from "../middleware/requireRole.js";
import {
  listMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone,
} from "../controllers/milestone.controller.js";

const router = Router();

router.get("/", requireAuth, listMilestones);

router.post(
  "/",
  requireAuth,
  requireRole("ADMIN", "TEAM_LEADER", "PROJECT_MANAGER"),
  createMilestone
);

router.patch(
  "/:id",
  requireAuth,
  requireRole("ADMIN", "TEAM_LEADER", "PROJECT_MANAGER"),
  updateMilestone
);

router.delete(
  "/:id",
  requireAuth,
  requireRole("ADMIN", "TEAM_LEADER", "PROJECT_MANAGER"),
  deleteMilestone
);

export default router;