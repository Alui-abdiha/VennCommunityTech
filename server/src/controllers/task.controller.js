import Task from "../models/Task.js";
import User from "../models/User.js";
import Project from "../models/Project.js";

export async function listTasks(req, res) {
  try {
    let query = {};

    if (req.user.role === "MEMBER") {
      query.assignedTo = req.user._id;
    } else if (req.user.role === "PROJECT_MANAGER") {
      const myProjects = await Project.find({ managerId: req.user._id }).select("_id");
      query.projectId = { $in: myProjects.map((p) => p._id) };
    } else if (req.user.role === "TEAM_LEADER") {
      const myProjects = await Project.find({ leaderId: req.user._id }).select("_id");
      query.projectId = { $in: myProjects.map((p) => p._id) };
    }

    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .populate("assignedTo", "fullName email role points")
      .populate("projectId", "name managerId leaderId")
      .populate("createdBy", "fullName role")
      .populate("completedBy", "fullName role")
      .populate("confirmedBy", "fullName role")
      .populate("rejectedBy", "fullName role");

    res.json({ ok: true, tasks });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message || "Failed to load tasks",
    });
  }
}

export async function createTask(req, res) {
  try {
    const {
      title,
      description = "",
      projectId,
      assignedTo,
      points = 10,
    } = req.body;

    if (!title || !projectId || !assignedTo) {
      return res.status(400).json({
        ok: false,
        message: "title, projectId and assignedTo are required",
      });
    }

    const safePoints = Number(points);
    if (Number.isNaN(safePoints) || safePoints < 1) {
      return res.status(400).json({
        ok: false,
        message: "Points must be at least 1",
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        ok: false,
        message: "Project not found",
      });
    }

    if (
      req.user.role === "PROJECT_MANAGER" &&
      String(project.managerId) !== String(req.user._id)
    ) {
      return res.status(403).json({
        ok: false,
        message: "You can only create tasks in your own project",
      });
    }

    if (
      req.user.role === "TEAM_LEADER" &&
      String(project.leaderId) !== String(req.user._id)
    ) {
      return res.status(403).json({
        ok: false,
        message: "You can only create tasks in your own project",
      });
    }

    const member = await User.findById(assignedTo);
    if (!member) {
      return res.status(404).json({
        ok: false,
        message: "Assigned member not found",
      });
    }

    if (member.role !== "MEMBER") {
      return res.status(400).json({
        ok: false,
        message: "Task can only be assigned to MEMBER",
      });
    }

    const isMemberInProject = project.members.some(
      (item) => String(item) === String(assignedTo)
    );

    if (!isMemberInProject) {
      return res.status(400).json({
        ok: false,
        message: "Selected user is not a member of this project",
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description.trim(),
      projectId,
      assignedTo,
      points: safePoints,
      status: "TODO",
      createdBy: req.user._id,
    });

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "fullName email role points")
      .populate("projectId", "name managerId leaderId")
      .populate("createdBy", "fullName role");

    res.status(201).json({
      ok: true,
      message: "Task created successfully",
      task: populatedTask,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message || "Failed to create task",
    });
  }
}

export async function completeTask(req, res) {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        ok: false,
        message: "Task not found",
      });
    }

    if (String(task.assignedTo) !== String(req.user._id)) {
      return res.status(403).json({
        ok: false,
        message: "You can only complete your own task",
      });
    }

    if (task.status === "CONFIRMED") {
      return res.status(400).json({
        ok: false,
        message: "Task is already confirmed",
      });
    }

    task.status = "COMPLETED";
    task.completedBy = req.user._id;
    task.completedAt = new Date();

    task.confirmedBy = null;
    task.confirmedAt = null;
    task.rejectedBy = null;
    task.rejectedAt = null;

    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "fullName email role points")
      .populate("projectId", "name managerId leaderId")
      .populate("completedBy", "fullName role");

    res.json({
      ok: true,
      message: "Task marked as completed",
      task: populatedTask,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message || "Failed to complete task",
    });
  }
}

export async function confirmTask(req, res) {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        ok: false,
        message: "Task not found",
      });
    }

    if (task.status !== "COMPLETED") {
      return res.status(400).json({
        ok: false,
        message: "Only completed tasks can be confirmed",
      });
    }

    if (req.user.role !== "ADMIN") {
      const project = await Project.findById(task.projectId).select("managerId");
      const isManager =
        project && String(project.managerId) === String(req.user._id);

      if (!isManager) {
        return res.status(403).json({
          ok: false,
          message: "Only the project manager can confirm this task",
        });
      }
    }

    task.status = "CONFIRMED";
    task.confirmedBy = req.user._id;
    task.confirmedAt = new Date();
    task.rejectedBy = null;
    task.rejectedAt = null;

    await task.save();

    const updatedUser = await User.findByIdAndUpdate(
      task.assignedTo,
      { $inc: { points: Number(task.points) || 0 } },
      { new: true }
    ).select("fullName points");

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "fullName email role points")
      .populate("projectId", "name managerId leaderId")
      .populate("confirmedBy", "fullName role");

    res.json({
      ok: true,
      message: "Task confirmed and points added",
      task: populatedTask,
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message || "Failed to confirm task",
    });
  }
}

export async function rejectTask(req, res) {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        ok: false,
        message: "Task not found",
      });
    }

    if (task.status !== "COMPLETED") {
      return res.status(400).json({
        ok: false,
        message: "Only completed tasks can be rejected",
      });
    }

    if (req.user.role !== "ADMIN") {
      const project = await Project.findById(task.projectId).select("managerId");
      const isManager =
        project && String(project.managerId) === String(req.user._id);

      if (!isManager) {
        return res.status(403).json({
          ok: false,
          message: "Only the project manager can reject this task",
        });
      }
    }

    task.status = "REJECTED";
    task.rejectedBy = req.user._id;
    task.rejectedAt = new Date();
    task.confirmedBy = null;
    task.confirmedAt = null;

    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "fullName email role points")
      .populate("projectId", "name managerId leaderId")
      .populate("rejectedBy", "fullName role");

    res.json({
      ok: true,
      message: "Task rejected",
      task: populatedTask,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message || "Failed to reject task",
    });
  }
}