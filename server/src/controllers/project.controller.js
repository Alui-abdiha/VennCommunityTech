import Project from "../models/Project.js";
import User from "../models/User.js";
import Task from "../models/Task.js";

const PROJECT_STATUSES = [
  "PLANNING",
  "ACTIVE",
  "ON_HOLD",
  "DONE",
  "CANCELLED",
];

const PROJECT_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"];

function clampProgress(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return 0;
  return Math.max(0, Math.min(100, num));
}

function normalizeUrl(url = "") {
  const value = String(url || "").trim();
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `https://${value}`;
}

function normalizeTags(tags) {
  if (Array.isArray(tags)) {
    return tags
      .map((t) => String(t || "").trim())
      .filter(Boolean);
  }

  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }

  return [];
}

function canViewProject(project, user) {
  if (!project || !user) return false;
  if (user.role === "ADMIN") return true;
  if (String(project.leaderId) === String(user._id)) return true;
  if (String(project.managerId) === String(user._id)) return true;

  return (project.members || []).some(
    (memberId) => String(memberId) === String(user._id)
  );
}

function canManageProject(project, user) {
  if (!project || !user) return false;
  if (user.role === "ADMIN") return true;
  if (String(project.leaderId) === String(user._id)) return true;
  if (String(project.managerId) === String(user._id)) return true;
  return false;
}

function canChangeManager(project, user) {
  if (!project || !user) return false;
  if (user.role === "ADMIN") return true;
  if (String(project.leaderId) === String(user._id)) return true;
  return false;
}

async function recalculateProjectProgress(projectId) {
  const tasks = await Task.find({ projectId }).select("status progress");

  if (!tasks.length) {
    await Project.findByIdAndUpdate(projectId, { progress: 0 });
    return 0;
  }

  const total = tasks.reduce((sum, task) => {
    if (task.status === "CONFIRMED") return sum + 100;
    return sum + clampProgress(task.progress || 0);
  }, 0);

  const avg = Math.round(total / tasks.length);

  await Project.findByIdAndUpdate(projectId, { progress: avg });
  return avg;
}

async function populateProject(projectId) {
  return Project.findById(projectId)
    .populate("teamId", "name")
    .populate("leaderId", "fullName email role")
    .populate("managerId", "fullName email role teamId")
    .populate("members", "fullName email role teamId");
}

export async function listProjects(req, res) {
  try {
    let query = {};

    if (req.user.role === "TEAM_LEADER") {
      query.leaderId = req.user._id;
    } else if (req.user.role === "PROJECT_MANAGER") {
      query.managerId = req.user._id;
    } else if (req.user.role === "MEMBER") {
      query.members = req.user._id;
    }

    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .populate("teamId", "name")
      .populate("leaderId", "fullName email role")
      .populate("managerId", "fullName email role teamId")
      .populate("members", "fullName email role teamId");

    res.json({ ok: true, projects });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
}

export async function getProjectById(req, res) {
  try {
    const project = await Project.findById(req.params.id)
      .populate("teamId", "name")
      .populate("leaderId", "fullName email role")
      .populate("managerId", "fullName email role teamId")
      .populate("members", "fullName email role teamId");

    if (!project) {
      return res.status(404).json({ ok: false, message: "Project not found" });
    }

    if (!canViewProject(project, req.user)) {
      return res.status(403).json({ ok: false, message: "Forbidden" });
    }

    res.json({ ok: true, project });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
}

export async function createProject(req, res) {
  try {
    const {
      name,
      description = "",
      teamId,
      managerId,
      status = "PLANNING",
      priority = "MEDIUM",
      startDate = null,
      endDate = null,
      progress = 0,
      clientName = "",
      githubUrl = "",
      liveUrl = "",
      docsUrl = "",
      figmaUrl = "",
      chatUrl = "",
      driveUrl = "",
      tags = [],
      lastUpdate = "",
    } = req.body;

    if (!name?.trim() || !managerId) {
      return res.status(400).json({
        ok: false,
        message: "name and managerId are required",
      });
    }

    if (!PROJECT_STATUSES.includes(status)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid project status",
      });
    }

    if (!PROJECT_PRIORITIES.includes(priority)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid project priority",
      });
    }

    const effectiveTeamId =
      req.user.role === "TEAM_LEADER" ? req.user.teamId : teamId;

    if (!effectiveTeamId) {
      return res.status(400).json({
        ok: false,
        message: "Team is required",
      });
    }

    const manager = await User.findById(managerId);

    if (!manager) {
      return res.status(404).json({
        ok: false,
        message: "Project manager not found",
      });
    }

    if (manager.role !== "PROJECT_MANAGER") {
      return res.status(400).json({
        ok: false,
        message: "Selected user is not a PROJECT_MANAGER",
      });
    }

    if (!manager.teamId || String(manager.teamId) !== String(effectiveTeamId)) {
      return res.status(400).json({
        ok: false,
        message: "Project manager must belong to your team",
      });
    }

    const project = await Project.create({
      name: name.trim(),
      description,
      teamId: effectiveTeamId,
      leaderId: req.user._id,
      managerId,
      members: [],
      status,
      priority,
      startDate: startDate || null,
      endDate: endDate || null,
      progress: clampProgress(progress),
      clientName: String(clientName || "").trim(),
      githubUrl: normalizeUrl(githubUrl),
      liveUrl: normalizeUrl(liveUrl),
      docsUrl: normalizeUrl(docsUrl),
      figmaUrl: normalizeUrl(figmaUrl),
      chatUrl: normalizeUrl(chatUrl),
      driveUrl: normalizeUrl(driveUrl),
      tags: normalizeTags(tags),
      lastUpdate: String(lastUpdate || "").trim(),
    });

    const populatedProject = await populateProject(project._id);

    res.json({ ok: true, project: populatedProject });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
}

export async function updateProject(req, res) {
  try {
    const {
      name,
      description,
      managerId,
      status,
      priority,
      startDate,
      endDate,
      progress,
      clientName,
      githubUrl,
      liveUrl,
      docsUrl,
      figmaUrl,
      chatUrl,
      driveUrl,
      tags,
      lastUpdate,
    } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ ok: false, message: "Project not found" });
    }

    if (!canManageProject(project, req.user)) {
      return res.status(403).json({ ok: false, message: "Forbidden" });
    }

    if (name !== undefined) {
      const cleanName = String(name || "").trim();
      if (!cleanName) {
        return res.status(400).json({
          ok: false,
          message: "Project name cannot be empty",
        });
      }
      project.name = cleanName;
    }

    if (description !== undefined) {
      project.description = description;
    }

    if (status !== undefined) {
      if (!PROJECT_STATUSES.includes(status)) {
        return res.status(400).json({
          ok: false,
          message: "Invalid project status",
        });
      }
      project.status = status;
    }

    if (priority !== undefined) {
      if (!PROJECT_PRIORITIES.includes(priority)) {
        return res.status(400).json({
          ok: false,
          message: "Invalid project priority",
        });
      }
      project.priority = priority;
    }

    if (startDate !== undefined) {
      project.startDate = startDate || null;
    }

    if (endDate !== undefined) {
      project.endDate = endDate || null;
    }

    if (progress !== undefined) {
      project.progress = clampProgress(progress);
    }

    if (clientName !== undefined) {
      project.clientName = String(clientName || "").trim();
    }

    if (githubUrl !== undefined) {
      project.githubUrl = normalizeUrl(githubUrl);
    }

    if (liveUrl !== undefined) {
      project.liveUrl = normalizeUrl(liveUrl);
    }

    if (docsUrl !== undefined) {
      project.docsUrl = normalizeUrl(docsUrl);
    }

    if (figmaUrl !== undefined) {
      project.figmaUrl = normalizeUrl(figmaUrl);
    }

    if (chatUrl !== undefined) {
      project.chatUrl = normalizeUrl(chatUrl);
    }

    if (driveUrl !== undefined) {
      project.driveUrl = normalizeUrl(driveUrl);
    }

    if (tags !== undefined) {
      project.tags = normalizeTags(tags);
    }

    if (lastUpdate !== undefined) {
      project.lastUpdate = String(lastUpdate || "").trim();
    }

    if (managerId !== undefined && managerId !== String(project.managerId)) {
      if (!canChangeManager(project, req.user)) {
        return res.status(403).json({
          ok: false,
          message: "Only admin or team leader can change manager",
        });
      }

      const manager = await User.findById(managerId);

      if (!manager) {
        return res.status(404).json({
          ok: false,
          message: "Project manager not found",
        });
      }

      if (manager.role !== "PROJECT_MANAGER") {
        return res.status(400).json({
          ok: false,
          message: "Selected user is not a PROJECT_MANAGER",
        });
      }

      if (!manager.teamId || String(manager.teamId) !== String(project.teamId)) {
        return res.status(400).json({
          ok: false,
          message: "Project manager must belong to the same team",
        });
      }

      project.managerId = managerId;
    }

    await project.save();

    const populated = await populateProject(project._id);

    res.json({ ok: true, project: populated });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
}

export async function updateProjectStatus(req, res) {
  try {
    const { status } = req.body;

    if (!PROJECT_STATUSES.includes(status)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid status",
      });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ ok: false, message: "Project not found" });
    }

    if (!canManageProject(project, req.user)) {
      return res.status(403).json({ ok: false, message: "Forbidden" });
    }

    project.status = status;
    await project.save();

    const populated = await populateProject(project._id);

    res.json({ ok: true, project: populated });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
}

export async function refreshProjectProgress(req, res) {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ ok: false, message: "Project not found" });
    }

    if (!canViewProject(project, req.user)) {
      return res.status(403).json({ ok: false, message: "Forbidden" });
    }

    const progress = await recalculateProjectProgress(project._id);

    res.json({ ok: true, progress });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
}

export async function deleteProject(req, res) {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ ok: false, message: "Project not found" });
    }

    const isAdmin = req.user.role === "ADMIN";
    const isLeader = String(project.leaderId) === String(req.user._id);

    if (!isAdmin && !isLeader) {
      return res.status(403).json({ ok: false, message: "Forbidden" });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({ ok: true, message: "Project deleted successfully" });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
}

export async function assignProjectPeople(req, res) {
  try {
    const { members = [] } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ ok: false, message: "Project not found" });
    }

    if (!canManageProject(project, req.user)) {
      return res.status(403).json({ ok: false, message: "Forbidden" });
    }

    const users = await User.find({
      _id: { $in: members },
      role: "MEMBER",
      teamId: project.teamId,
      status: "APPROVED",
    }).select("_id");

    const validMemberIds = users.map((u) => String(u._id));

    project.members = validMemberIds;
    await project.save();

    const progress = await recalculateProjectProgress(project._id);
    project.progress = progress;

    const populated = await populateProject(project._id);

    res.json({ ok: true, project: populated });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
}

export async function getProjectMembers(req, res) {
  try {
    const project = await Project.findById(req.params.id).populate(
      "members",
      "fullName email role teamId"
    );

    if (!project) {
      return res.status(404).json({ ok: false, message: "Project not found" });
    }

    if (!canManageProject(project, req.user) && req.user.role !== "ADMIN") {
      return res.status(403).json({ ok: false, message: "Forbidden" });
    }

    res.json({ ok: true, members: project.members || [] });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
}

export async function getAssignableManagers(req, res) {
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

export async function getAssignableMembers(req, res) {
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