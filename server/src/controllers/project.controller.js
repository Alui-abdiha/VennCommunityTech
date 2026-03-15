import Project from "../models/Project.js";
import User from "../models/User.js";

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
      .populate("members", "fullName email role");

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

    if (
      req.user.role === "TEAM_LEADER" &&
      String(project.leaderId?._id || project.leaderId) !== String(req.user._id)
    ) {
      return res.status(403).json({ ok: false, message: "Forbidden" });
    }

    if (
      req.user.role === "PROJECT_MANAGER" &&
      String(project.managerId?._id || project.managerId) !== String(req.user._id)
    ) {
      return res.status(403).json({ ok: false, message: "Forbidden" });
    }

    if (
      req.user.role === "MEMBER" &&
      !(project.members || []).some((m) => String(m._id || m) === String(req.user._id))
    ) {
      return res.status(403).json({ ok: false, message: "Forbidden" });
    }

    res.json({ ok: true, project });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
}

export async function createProject(req, res) {
  try {
    const { name, description = "", teamId, managerId } = req.body;

    if (!name || !managerId) {
      return res.status(400).json({
        ok: false,
        message: "name and managerId are required",
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
      name,
      description,
      teamId: effectiveTeamId,
      leaderId: req.user._id,
      managerId,
      members: [],
      status: "ACTIVE",
    });

    const populatedProject = await Project.findById(project._id)
      .populate("teamId", "name")
      .populate("leaderId", "fullName email role")
      .populate("managerId", "fullName email role")
      .populate("members", "fullName email role");

    res.json({ ok: true, project: populatedProject });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
}

export async function updateProject(req, res) {
  try {
    const { name, description = "", managerId } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ ok: false, message: "Project not found" });
    }

    if (
      req.user.role === "TEAM_LEADER" &&
      String(project.leaderId) !== String(req.user._id)
    ) {
      return res.status(403).json({ ok: false, message: "Forbidden" });
    }

    if (name) {
      project.name = name.trim();
    }

    project.description = description;

    if (managerId) {
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

    const populated = await Project.findById(project._id)
      .populate("teamId", "name")
      .populate("leaderId", "fullName email role")
      .populate("managerId", "fullName email role")
      .populate("members", "fullName email role");

    res.json({ ok: true, project: populated });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
}

export async function updateProjectStatus(req, res) {
  try {
    const { status } = req.body;

    if (!["ACTIVE", "DONE"].includes(status)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid status",
      });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ ok: false, message: "Project not found" });
    }

    if (
      req.user.role === "TEAM_LEADER" &&
      String(project.leaderId) !== String(req.user._id)
    ) {
      return res.status(403).json({ ok: false, message: "Forbidden" });
    }

    project.status = status;
    await project.save();

    const populated = await Project.findById(project._id)
      .populate("teamId", "name")
      .populate("leaderId", "fullName email role")
      .populate("managerId", "fullName email role")
      .populate("members", "fullName email role");

    res.json({ ok: true, project: populated });
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

    if (
      req.user.role === "TEAM_LEADER" &&
      String(project.leaderId) !== String(req.user._id)
    ) {
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

    if (
      req.user.role === "TEAM_LEADER" &&
      String(project.leaderId) !== String(req.user._id)
    ) {
      return res.status(403).json({ ok: false, message: "Forbidden" });
    }

    if (
      req.user.role === "PROJECT_MANAGER" &&
      String(project.managerId) !== String(req.user._id)
    ) {
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

    const populated = await Project.findById(project._id)
      .populate("teamId", "name")
      .populate("leaderId", "fullName email role")
      .populate("managerId", "fullName email role")
      .populate("members", "fullName email role");

    res.json({ ok: true, project: populated });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
}