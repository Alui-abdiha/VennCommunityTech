import { Router } from "express";
import {
 listTasks,
  createTask,
  completeTask,
  confirmTask,
  rejectTask,
  updateTaskProgress,
  addTaskComment,
  listTaskComments,
} from "../controllers/task.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireRole } from "../middleware/requireRole.js";

const router = Router();

router.get("/", requireAuth, listTasks);

router.post(
  "/",
  requireAuth,
  requireRole("ADMIN", "TEAM_LEADER", "PROJECT_MANAGER"),
  createTask
);

router.patch(
  "/:id/complete",
  requireAuth,
  requireRole("MEMBER"),
  completeTask
);

router.patch(
  "/:id/confirm",
  requireAuth,
  requireRole("ADMIN", "PROJECT_MANAGER"),
  confirmTask
);
router.patch(
  "/:id/progress",
  requireAuth,
  requireRole,
  updateTaskProgress
);router.patch(
  "/:id/reject",
  requireAuth,
  requireRole("ADMIN", "PROJECT_MANAGER"),
  rejectTask
);

router.get(
  "/:id/comments",
  requireAuth,
  listTaskComments
);

router.post(
  "/:id/comments",
  requireAuth,
  requireRole("ADMIN", "TEAM_LEADER", "PROJECT_MANAGER", "MEMBER"),
  addTaskComment
);

export default router;