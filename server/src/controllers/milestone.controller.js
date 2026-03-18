import Milestone from "../models/Milestone.js";
import Project from "../models/Project.js";

const STATUSES = ["PENDING", "IN_PROGRESS", "DONE"];

function clampProgress(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return 0;
  return Math.max(0, Math.min(100, num));
}

async function canAccessProject(project, user) {
  if (!project) return false;

  if (user.role === "ADMIN") return true;
  if (user.role === "TEAM_LEADER" && String(project.leaderId) === String(user._id)) return true;
  if (user.role === "PROJECT_MANAGER" && String(project.managerId) === String(user._id)) return true;
  if (user.role === "MEMBER" && (project.members || []).some((id) => String(id) === String(user._id))) return true;

  return false;
}

export async function listMilestones(req, res) {
  try {
    const { projectId } = req.query;

    const query = {};
    if (projectId) query.projectId = projectId;

    const milestones = await Milestone.find(query)
      .sort({ dueDate: 1, createdAt: -1 })
      .populate("projectId", "name teamId leaderId managerId members")
      .populate("createdBy", "fullName role");

    const filtered = milestones.filter((m) => {
      const project = m.projectId;
      if (!project) return false;
      if (req.user.role === "ADMIN") return true;
      if (req.user.role === "TEAM_LEADER") return String(project.leaderId) === String(req.user._id);
      if (req.user.role === "PROJECT_MANAGER") return String(project.managerId) === String(req.user._id);
      if (req.user.role === "MEMBER") {
        return (project.members || []).some((id) => String(id) === String(req.user._id));
      }
      return false;
    });

    res.json({ ok: true, milestones: filtered });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
}

export async function createMilestone(req, res) {
  try {
    const {
      projectId,
      title,
      description = "",
      dueDate = null,
      status = "PENDING",
      progress = 0,
    } = req.body;

    if (!projectId || !title) {
      return res.status(400).json({
        ok: false,
        message: "projectId and title are required",
      });
    }

    if (!STATUSES.includes(status)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid milestone status",
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        ok: false,
        message: "Project not found",
      });
    }

    const allowed = await canAccessProject(project, req.user);
    if (!allowed || req.user.role === "MEMBER") {
      return res.status(403).json({
        ok: false,
        message: "Forbidden",
      });
    }

    const milestone = await Milestone.create({
      projectId,
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || null,
      status,
      progress: clampProgress(progress),
      createdBy: req.user._id,
    });

    const populated = await Milestone.findById(milestone._id)
      .populate("projectId", "name")
      .populate("createdBy", "fullName role");

    res.status(201).json({
      ok: true,
      message: "Milestone created successfully",
      milestone: populated,
    });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
}

export async function updateMilestone(req, res) {
  try {
    const { title, description, dueDate, status, progress } = req.body;

    const milestone = await Milestone.findById(req.params.id);
    if (!milestone) {
      return res.status(404).json({
        ok: false,
        message: "Milestone not found",
      });
    }

    const project = await Project.findById(milestone.projectId);
    const allowed = await canAccessProject(project, req.user);

    if (!allowed || req.user.role === "MEMBER") {
      return res.status(403).json({
        ok: false,
        message: "Forbidden",
      });
    }

    if (title !== undefined) milestone.title = title.trim();
    if (description !== undefined) milestone.description = description;
    if (dueDate !== undefined) milestone.dueDate = dueDate || null;

    if (status !== undefined) {
      if (!STATUSES.includes(status)) {
        return res.status(400).json({
          ok: false,
          message: "Invalid milestone status",
        });
      }
      milestone.status = status;
    }

    if (progress !== undefined) {
      milestone.progress = clampProgress(progress);
    }

    if (milestone.status === "DONE") {
      milestone.progress = 100;
    }

    if (milestone.status === "PENDING" && milestone.progress > 0) {
      milestone.status = "IN_PROGRESS";
    }

    await milestone.save();

    const populated = await Milestone.findById(milestone._id)
      .populate("projectId", "name")
      .populate("createdBy", "fullName role");

    res.json({ ok: true, milestone: populated });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
}

export async function deleteMilestone(req, res) {
  try {
    const milestone = await Milestone.findById(req.params.id);
    if (!milestone) {
      return res.status(404).json({
        ok: false,
        message: "Milestone not found",
      });
    }

    const project = await Project.findById(milestone.projectId);
    const allowed = await canAccessProject(project, req.user);

    if (!allowed || req.user.role === "MEMBER") {
      return res.status(403).json({
        ok: false,
        message: "Forbidden",
      });
    }

    await Milestone.findByIdAndDelete(req.params.id);

    res.json({
      ok: true,
      message: "Milestone deleted successfully",
    });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
}