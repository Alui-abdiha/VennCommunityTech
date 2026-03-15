import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import User from "../models/User.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";

const router = Router();

router.get("/dashboard", requireAuth, async (req, res) => {
  try {
    let projects = 0;
    let tasks = 0;
    let activeMembers = 0;

    // ADMIN => everything
    if (req.user.role === "ADMIN") {
      projects = await Project.countDocuments();
      tasks = await Task.countDocuments();
      activeMembers = await User.countDocuments({ status: "APPROVED" });
    }

    // TEAM LEADER => only their own team/projects
    else if (req.user.role === "TEAM_LEADER") {
      const myProjects = await Project.find({ leaderId: req.user._id }).select("_id");

      const projectIds = myProjects.map((p) => p._id);

      projects = myProjects.length;
      tasks = await Task.countDocuments({ projectId: { $in: projectIds } });
      activeMembers = await User.countDocuments({
        teamId: req.user.teamId,
        role: "MEMBER",
        status: "APPROVED",
      });
    }

    // PROJECT_MANAGER => only their own managed projects
    else if (req.user.role === "PROJECT_MANAGER") {
      const myProjects = await Project.find({ managerId: req.user._id }).select("_id");

      const projectIds = myProjects.map((p) => p._id);

      projects = myProjects.length;
      tasks = await Task.countDocuments({ projectId: { $in: projectIds } });

      activeMembers = await User.countDocuments({
        _id: {
          $in: await Project.distinct("members", {
            managerId: req.user._id,
          }),
        },
        status: "APPROVED",
      });
    }

    // MEMBER => only personal work
    else if (req.user.role === "MEMBER") {
      projects = await Project.countDocuments({ members: req.user._id });
      tasks = await Task.countDocuments({ assignedTo: req.user._id });
      activeMembers = 1;
    }

    res.json({
      ok: true,
      stats: {
        projects,
        tasks,
        points: req.user.points || 0,
        activeMembers,
      },
    });
  } catch (e) {
    res.status(500).json({
      ok: false,
      message: e.message,
    });
  }
});

router.get("/leaderboard", requireAuth, async (req, res) => {
  try {
    let query = { status: "APPROVED" };

    // TEAM_LEADER => only their team
    if (req.user.role === "TEAM_LEADER") {
      query.teamId = req.user.teamId;
    }

    // PROJECT_MANAGER => only members in their managed projects
    if (req.user.role === "PROJECT_MANAGER") {
      const memberIds = await Project.distinct("members", {
        managerId: req.user._id,
      });

      query._id = { $in: memberIds };
    }

    // MEMBER => can still see all approved users, or you can limit later

    const users = await User.find(query)
      .sort({ points: -1 })
      .limit(20)
      .select("fullName role points");

    res.json({ ok: true, users });
  } catch (e) {
    res.status(500).json({
      ok: false,
      message: e.message,
    });
  }
});

export default router;