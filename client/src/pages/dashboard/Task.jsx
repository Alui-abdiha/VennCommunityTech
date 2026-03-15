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
} from "lucide-react";

export default function Task() {
  const user = getUser();

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    projectId: "",
    assignedTo: "",
    points: 10,
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

  function resetForm() {
    setForm({
      title: "",
      description: "",
      projectId: "",
      assignedTo: "",
      points: 10,
    });
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
      setActionLoading(`reject-${taskId}`);
      await api.patch(`/tasks/${taskId}/reject`);
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
            Members complete tasks, managers confirm them, and points are added after approval.
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

              <div className="space-y-2 text-sm text-muted">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 truncate">
                    <User size={14} />
                    {task.assignedTo?.fullName ||
                      task.assignedTo?.name ||
                      "Unassigned"}
                  </span>

                  <span className="flex items-center gap-1 shrink-0">
                    <Award size={14} />
                    {task.points} pts
                  </span>
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

              <div className="flex flex-wrap gap-2 pt-2">
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
                Assign a task to a project member.
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