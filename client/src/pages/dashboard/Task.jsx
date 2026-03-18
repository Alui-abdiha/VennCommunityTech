import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";
import { getUser } from "../../services/auth";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

import {
  Award,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Plus,
  User,
  XCircle,
  CalendarDays,
  Flag,
  BarChart3,
  PlayCircle,
  MessageSquare,
  Send,
  AlertCircle,
} from "lucide-react";

const PRIORITY_OPTIONS = ["LOW", "MEDIUM", "HIGH", "URGENT"];
const COMMENT_TYPES = ["GENERAL", "ISSUE", "UPDATE"];

export default function Task() {
  const user = getUser();

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState("");
  const [commentInputs, setCommentInputs] = useState({});
  const [commentTypes, setCommentTypes] = useState({});
  const [commentLoading, setCommentLoading] = useState("");
  const [expandedComments, setExpandedComments] = useState({});

  const [form, setForm] = useState({
    title: "",
    description: "",
    projectId: "",
    assignedTo: "",
    points: 10,
    priority: "MEDIUM",
    progress: 0,
    startDate: "",
    deadline: "",
    status: "TODO",
  });

  const canCreate =
    user?.role === "ADMIN" ||
    user?.role === "TEAM_LEADER" ||
    user?.role === "PROJECT_MANAGER";

  function getId(value) {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object") return value._id || value.id || "";
    return "";
  }

  const selectedProject = useMemo(() => {
    return projects.find((project) => getId(project) === form.projectId) || null;
  }, [projects, form.projectId]);

  const filteredMembers = useMemo(() => {
    if (!selectedProject) return [];

    const projectMemberIds = (selectedProject.members || []).map((member) =>
      getId(member)
    );

    return members.filter((member) =>
      projectMemberIds.includes(getId(member))
    );
  }, [selectedProject, members]);

  async function loadTasks() {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error(err?.response?.data?.message || "Failed to load tasks");
      setTasks([]);
    }
  }

  async function loadProjects() {
    try {
      const res = await api.get("/projects");
      setProjects(res.data.projects || []);
    } catch (err) {
      console.error(err?.response?.data?.message || "Failed to load projects");
      setProjects([]);
    }
  }

  async function loadMembers() {
    try {
      if (!canCreate) {
        setMembers([]);
        return;
      }

      const res = await api.get("/users/team-members");
      setMembers(res.data.users || []);
    } catch (err) {
      console.error(err?.response?.data?.message || "Failed to load members");
      setMembers([]);
    }
  }

  async function initializePage() {
    try {
      setLoading(true);

      if (canCreate) {
        await Promise.all([loadTasks(), loadProjects(), loadMembers()]);
      } else {
        await Promise.all([loadTasks(), loadProjects()]);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    initializePage();
  }, []);

  function clampProgress(value) {
    const num = Number(value);
    if (Number.isNaN(num)) return 0;
    return Math.max(0, Math.min(100, num));
  }

  function resetForm() {
    setForm({
      title: "",
      description: "",
      projectId: "",
      assignedTo: "",
      points: 10,
      priority: "MEDIUM",
      progress: 0,
      startDate: "",
      deadline: "",
      status: "TODO",
    });
  }

  function toggleComments(taskId) {
    setExpandedComments((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  }

  async function addComment(taskId) {
    try {
      const message = commentInputs[taskId]?.trim();
      const type = commentTypes[taskId] || "GENERAL";

      if (!message) {
        alert("Please write a comment");
        return;
      }

      setCommentLoading(taskId);

      await api.post(`/tasks/${taskId}/comments`, {
        message,
        type,
      });

      setCommentInputs((prev) => ({
        ...prev,
        [taskId]: "",
      }));

      setCommentTypes((prev) => ({
        ...prev,
        [taskId]: "GENERAL",
      }));

      await loadTasks();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to add comment");
    } finally {
      setCommentLoading("");
    }
  }

  async function createTask() {
    try {
      if (!form.title.trim()) {
        alert("Task title is required");
        return;
      }

      if (!form.projectId) {
        alert("Please select a project");
        return;
      }

      if (!form.assignedTo) {
        alert("Please assign a member");
        return;
      }

      if (Number(form.points) < 1) {
        alert("Points must be at least 1");
        return;
      }

      setActionLoading("create");

      await api.post("/tasks", {
        title: form.title.trim(),
        description: form.description.trim(),
        projectId: form.projectId,
        assignedTo: form.assignedTo,
        points: Number(form.points) || 10,
        priority: form.priority,
        progress: clampProgress(form.progress),
        startDate: form.startDate || null,
        deadline: form.deadline || null,
        status: form.status,
      });

      resetForm();
      setOpen(false);
      await loadTasks();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to create task");
    } finally {
      setActionLoading("");
    }
  }

  async function startTask(taskId) {
    try {
      setActionLoading(`start-${taskId}`);
      await api.patch(`/tasks/${taskId}/progress`, {
        status: "IN_PROGRESS",
        progress: 25,
        startDate: new Date().toISOString(),
      });
      await loadTasks();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to start task");
    } finally {
      setActionLoading("");
    }
  }

  async function completeTask(taskId) {
    try {
      setActionLoading(`complete-${taskId}`);
      await api.patch(`/tasks/${taskId}/complete`);
      await loadTasks();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to complete task");
    } finally {
      setActionLoading("");
    }
  }

  async function confirmTask(taskId) {
    try {
      setActionLoading(`confirm-${taskId}`);
      await api.patch(`/tasks/${taskId}/confirm`);
      await loadTasks();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to confirm task");
    } finally {
      setActionLoading("");
    }
  }

  async function rejectTask(taskId) {
    try {
      const reason = window.prompt("Please enter rejection reason:");
      if (reason === null) return;

      setActionLoading(`reject-${taskId}`);
      await api.patch(`/tasks/${taskId}/reject`, { reason });
      await loadTasks();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to reject task");
    } finally {
      setActionLoading("");
    }
  }

  function getStatusClasses(status) {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-500/15 text-green-400 border border-green-500/20";
      case "COMPLETED":
        return "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20";
      case "REJECTED":
        return "bg-red-500/15 text-red-400 border border-red-500/20";
      case "IN_PROGRESS":
        return "bg-purple-500/15 text-purple-400 border border-purple-500/20";
      default:
        return "bg-blue-500/15 text-blue-400 border border-blue-500/20";
    }
  }

  function getPriorityClasses(priority) {
    switch (priority) {
      case "URGENT":
        return "text-red-400 border-red-500/20 bg-red-500/10";
      case "HIGH":
        return "text-orange-400 border-orange-500/20 bg-orange-500/10";
      case "MEDIUM":
        return "text-yellow-400 border-yellow-500/20 bg-yellow-500/10";
      default:
        return "text-emerald-400 border-emerald-500/20 bg-emerald-500/10";
    }
  }

  function getCommentTypeClasses(type) {
    switch (type) {
      case "ISSUE":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "UPDATE":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default:
        return "bg-white/5 text-slate-300 border-white/10";
    }
  }

  function formatDate(value) {
    return value ? new Date(value).toLocaleDateString() : "-";
  }

  function canStart(task) {
    const assignedUserId = getId(task.assignedTo);
    const loggedInUserId = getId(user);

    return (
      user?.role === "MEMBER" &&
      assignedUserId === loggedInUserId &&
      task.status === "TODO"
    );
  }

  function canComplete(task) {
    const assignedUserId = getId(task.assignedTo);
    const loggedInUserId = getId(user);

    return (
      user?.role === "MEMBER" &&
      assignedUserId === loggedInUserId &&
      task.status !== "CONFIRMED" &&
      task.status !== "COMPLETED"
    );
  }

  function canConfirm(task) {
    return (
      (user?.role === "PROJECT_MANAGER" || user?.role === "ADMIN") &&
      task.status === "COMPLETED"
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Tasks</h1>
          <p className="text-sm text-muted">
            Track progress, priorities, deadlines, approvals, and comments.
          </p>
        </div>

        {canCreate && (
          <Button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            New Task
          </Button>
        )}
      </div>

      {loading ? (
        <Card className="p-6 text-sm text-muted">Loading tasks...</Card>
      ) : tasks.length === 0 ? (
        <Card className="p-6 text-sm text-muted">No tasks found.</Card>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <Card
              key={task._id}
              className="p-5 flex flex-col justify-between gap-4 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-xl border soft-border flex items-center justify-center shrink-0">
                    <ClipboardList className="w-4 h-4 text-[rgb(var(--brand))]" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-base font-bold leading-tight truncate">
                      {task.title}
                    </h3>
                    <p className="text-sm text-muted truncate">
                      {task.projectId?.name || "No project"}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${getStatusClasses(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>
              </div>

              <div className="text-sm text-muted min-h-[40px]">
                {task.description || "No description provided."}
              </div>

              <div className="flex items-center justify-between gap-3 text-sm text-muted">
                <span className="flex items-center gap-2 truncate">
                  <User size={14} />
                  {task.assignedTo?.fullName || "Unassigned"}
                </span>

                <span className="flex items-center gap-1 shrink-0">
                  <Award size={14} />
                  {task.points} pts
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div
                  className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold ${getPriorityClasses(
                    task.priority || "MEDIUM"
                  )}`}
                >
                  <Flag size={12} />
                  {task.priority || "MEDIUM"}
                </div>

                <div className="text-xs text-muted">{task.progress || 0}%</div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between text-xs text-muted">
                  <span className="inline-flex items-center gap-2">
                    <BarChart3 size={13} />
                    Progress
                  </span>
                  <span>{task.progress || 0}%</span>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-[rgb(var(--brand))] transition-all"
                    style={{ width: `${task.progress || 0}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2 text-sm text-muted">
                <div className="flex items-center gap-2 text-xs">
                  <CalendarDays size={13} />
                  Start: {formatDate(task.startDate)}
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <CalendarDays size={13} />
                  Deadline: {formatDate(task.deadline)}
                </div>

                {task.completedAt && (
                  <div className="flex items-center gap-2 text-xs">
                    <Clock3 size={13} />
                    Completed: {new Date(task.completedAt).toLocaleString()}
                  </div>
                )}

                {task.confirmedAt && (
                  <div className="flex items-center gap-2 text-xs text-green-400">
                    <CheckCircle2 size={13} />
                    Confirmed: {new Date(task.confirmedAt).toLocaleString()}
                  </div>
                )}

                {task.rejectedAt && (
                  <div className="flex items-center gap-2 text-xs text-red-400">
                    <XCircle size={13} />
                    Rejected: {new Date(task.rejectedAt).toLocaleString()}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border soft-border p-3 space-y-3">
                <button
                  type="button"
                  className="w-full flex items-center justify-between text-sm font-semibold"
                  onClick={() => toggleComments(task._id)}
                >
                  <span className="inline-flex items-center gap-2">
                    <MessageSquare size={15} />
                    Comments ({task.comments?.length || 0})
                  </span>
                  <span className="text-xs text-muted">
                    {expandedComments[task._id] ? "Hide" : "Show"}
                  </span>
                </button>

                {expandedComments[task._id] && (
                  <>
                    <div className="max-h-56 overflow-y-auto space-y-2">
                      {(task.comments || []).length === 0 ? (
                        <p className="text-xs text-muted">No comments yet.</p>
                      ) : (
                        task.comments.map((comment) => (
                          <div
                            key={comment._id}
                            className="rounded-xl border soft-border p-3 text-sm"
                          >
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <div className="font-semibold text-xs">
                                {comment.authorId?.fullName || "Unknown User"} •{" "}
                                {comment.authorRole || "User"}
                              </div>
                              <div className="text-[11px] text-muted">
                                {comment.createdAt
                                  ? new Date(comment.createdAt).toLocaleString()
                                  : "-"}
                              </div>
                            </div>

                            <div
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] border mb-2 ${getCommentTypeClasses(
                                comment.type
                              )}`}
                            >
                              {comment.type === "ISSUE" && (
                                <AlertCircle size={11} />
                              )}
                              {comment.type || "GENERAL"}
                            </div>

                            <p className="text-sm text-muted whitespace-pre-wrap break-words">
                              {comment.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="space-y-2">
                      <select
                        className="w-full border soft-border rounded-xl px-3 py-2 bg-transparent outline-none text-sm"
                        value={commentTypes[task._id] || "GENERAL"}
                        onChange={(e) =>
                          setCommentTypes((prev) => ({
                            ...prev,
                            [task._id]: e.target.value,
                          }))
                        }
                      >
                        {COMMENT_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>

                      <div className="flex gap-2">
                        <Input
                          placeholder="Write a comment, issue, or update..."
                          value={commentInputs[task._id] || ""}
                          onChange={(e) =>
                            setCommentInputs((prev) => ({
                              ...prev,
                              [task._id]: e.target.value,
                            }))
                          }
                        />

                        <Button
                          onClick={() => addComment(task._id)}
                          disabled={commentLoading === task._id}
                          className="shrink-0"
                        >
                          <span className="inline-flex items-center gap-2">
                            <Send size={14} />
                            Send
                          </span>
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {canStart(task) && (
                  <Button
                    variant="outline"
                    className="flex-1 min-w-[120px]"
                    disabled={actionLoading === `start-${task._id}`}
                    onClick={() => startTask(task._id)}
                  >
                    <span className="inline-flex items-center gap-2">
                      <PlayCircle size={15} />
                      Start
                    </span>
                  </Button>
                )}

                {canComplete(task) && (
                  <Button
                    className="flex-1 min-w-[120px]"
                    disabled={actionLoading === `complete-${task._id}`}
                    onClick={() => completeTask(task._id)}
                  >
                    Complete
                  </Button>
                )}

                {canConfirm(task) && (
                  <>
                    <Button
                      className="flex-1 min-w-[120px]"
                      disabled={actionLoading === `confirm-${task._id}`}
                      onClick={() => confirmTask(task._id)}
                    >
                      Confirm
                    </Button>

                    <Button
                      variant="outline"
                      className="flex-1 min-w-[120px]"
                      disabled={actionLoading === `reject-${task._id}`}
                      onClick={() => rejectTask(task._id)}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {open && canCreate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm grid place-items-center p-4 z-50">
          <Card className="w-full max-w-lg p-6 space-y-4">
            <div>
              <h2 className="text-xl font-bold">Create Task</h2>
              <p className="text-sm text-muted">
                Assign a task with priority, progress, and deadline.
              </p>
            </div>

            <Input
              placeholder="Task title"
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
            />

            <Input
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
            />

            <select
              className="w-full border soft-border rounded-xl px-3 py-2 bg-transparent outline-none"
              value={form.projectId}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  projectId: e.target.value,
                  assignedTo: "",
                }))
              }
            >
              <option value="">Select project</option>
              {projects.map((project) => (
                <option key={getId(project)} value={getId(project)}>
                  {project.name}
                </option>
              ))}
            </select>

            <select
              className="w-full border soft-border rounded-xl px-3 py-2 bg-transparent outline-none"
              value={form.assignedTo}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, assignedTo: e.target.value }))
              }
              disabled={!form.projectId}
            >
              <option value="">
                {form.projectId ? "Assign member" : "Select project first"}
              </option>

              {filteredMembers.map((member) => (
                <option key={getId(member)} value={getId(member)}>
                  {member.fullName}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-3">
              <select
                className="w-full border soft-border rounded-xl px-3 py-2 bg-transparent outline-none"
                value={form.priority}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, priority: e.target.value }))
                }
              >
                {PRIORITY_OPTIONS.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>

              <select
                className="w-full border soft-border rounded-xl px-3 py-2 bg-transparent outline-none"
                value={form.status}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, status: e.target.value }))
                }
              >
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, startDate: e.target.value }))
                }
              />

              <Input
                type="date"
                value={form.deadline}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, deadline: e.target.value }))
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                min="1"
                placeholder="Points"
                value={form.points}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    points: e.target.value,
                  }))
                }
              />

              <Input
                type="number"
                min="0"
                max="100"
                placeholder="Progress %"
                value={form.progress}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    progress: clampProgress(e.target.value),
                  }))
                }
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>

              <Button
                onClick={createTask}
                disabled={actionLoading === "create"}
              >
                Create Task
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}