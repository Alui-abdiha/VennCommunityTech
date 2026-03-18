import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";
import { getUser } from "../../services/auth";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import {
  Flag,
  Plus,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

const STATUS_OPTIONS = ["PENDING", "IN_PROGRESS", "DONE"];

export default function Milestones() {
  const user = getUser();

  const [milestones, setMilestones] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [form, setForm] = useState({
    projectId: "",
    title: "",
    description: "",
    dueDate: "",
    status: "PENDING",
    progress: 0,
  });

  const canManage =
    user?.role === "ADMIN" ||
    user?.role === "TEAM_LEADER" ||
    user?.role === "PROJECT_MANAGER";

  async function loadMilestones() {
    const res = await api.get("/milestones");
    setMilestones(res.data.milestones || []);
  }

  async function loadProjects() {
    const res = await api.get("/projects");
    setProjects(res.data.projects || []);
  }

  async function init() {
    try {
      setLoading(true);
      await Promise.all([loadMilestones(), loadProjects()]);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to load milestones");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    init();
  }, []);

  function resetForm() {
    setForm({
      projectId: "",
      title: "",
      description: "",
      dueDate: "",
      status: "PENDING",
      progress: 0,
    });
    setEditMode(false);
  }

  function formatDate(date) {
    return date ? new Date(date).toLocaleDateString() : "-";
  }

  function getStatusClass(status) {
    if (status === "DONE") {
      return "bg-green-500/15 text-green-400 border border-green-500/20";
    }
    if (status === "IN_PROGRESS") {
      return "bg-blue-500/15 text-blue-400 border border-blue-500/20";
    }
    return "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20";
  }

  async function saveMilestone() {
    try {
      if (!form.projectId || !form.title.trim()) {
        alert("Project and title are required");
        return;
      }

      setSaving(true);

      const payload = {
        projectId: form.projectId,
        title: form.title,
        description: form.description,
        dueDate: form.dueDate || null,
        status: form.status,
        progress: Number(form.progress) || 0,
      };

      if (editMode && form._id) {
        await api.patch(`/milestones/${form._id}`, payload);
      } else {
        await api.post("/milestones", payload);
      }

      setOpen(false);
      resetForm();
      await loadMilestones();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to save milestone");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(item) {
    setForm({
      _id: item._id,
      projectId: item.projectId?._id || "",
      title: item.title || "",
      description: item.description || "",
      dueDate: item.dueDate ? new Date(item.dueDate).toISOString().split("T")[0] : "",
      status: item.status || "PENDING",
      progress: Number(item.progress || 0),
    });
    setEditMode(true);
    setOpen(true);
  }

  async function handleDelete() {
    try {
      if (!deleteTarget) return;
      await api.delete(`/milestones/${deleteTarget._id}`);
      setDeleteTarget(null);
      await loadMilestones();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete milestone");
    }
  }

  const grouped = useMemo(() => {
    return milestones;
  }, [milestones]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Milestones</h1>
          <p className="text-sm text-muted">
            Track key project checkpoints and target dates.
          </p>
        </div>

        {canManage && (
          <Button
            onClick={() => {
              resetForm();
              setOpen(true);
            }}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            New Milestone
          </Button>
        )}
      </div>

      {loading ? (
        <Card className="p-6 text-sm text-muted">Loading milestones...</Card>
      ) : grouped.length === 0 ? (
        <Card className="p-6 text-sm text-muted">No milestones found.</Card>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {grouped.map((item) => (
            <Card key={item._id} className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-base">{item.title}</h3>
                  <p className="text-sm text-muted">
                    {item.projectId?.name || "No project"}
                  </p>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${getStatusClass(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </div>

              <p className="text-sm text-muted min-h-[40px]">
                {item.description || "No description provided."}
              </p>

              <div className="space-y-2 text-sm text-muted">
                <div className="flex items-center gap-2">
                  <CalendarDays size={14} />
                  Due: {formatDate(item.dueDate)}
                </div>

                <div className="flex items-center gap-2">
                  <Flag size={14} />
                  Progress: {item.progress || 0}%
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-[rgb(var(--brand))]"
                    style={{ width: `${item.progress || 0}%` }}
                  />
                </div>
              </div>

              {canManage && (
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" onClick={() => handleEdit(item)}>
                    <span className="inline-flex items-center gap-2">
                      <Pencil size={15} />
                      Edit
                    </span>
                  </Button>

                  <Button variant="outline" onClick={() => setDeleteTarget(item)}>
                    <span className="inline-flex items-center gap-2">
                      <Trash2 size={15} />
                      Delete
                    </span>
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  {editMode ? "Edit Milestone" : "Create Milestone"}
                </h2>
                <p className="text-sm text-muted">
                  Add a project checkpoint with due date and progress.
                </p>
              </div>

              <button
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
                className="rounded-xl border soft-border p-2 text-muted"
              >
                <X size={18} />
              </button>
            </div>

            <select
              className="w-full border soft-border rounded-xl px-3 py-2 bg-transparent outline-none"
              value={form.projectId}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, projectId: e.target.value }))
              }
            >
              <option value="">Select project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>

            <Input
              placeholder="Milestone title"
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

            <div className="grid grid-cols-2 gap-3">
              <Input
                type="date"
                value={form.dueDate}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, dueDate: e.target.value }))
                }
              />

              <select
                className="w-full border soft-border rounded-xl px-3 py-2 bg-transparent outline-none"
                value={form.status}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, status: e.target.value }))
                }
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <Input
              type="number"
              min="0"
              max="100"
              placeholder="Progress %"
              value={form.progress}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  progress: Math.max(0, Math.min(100, Number(e.target.value) || 0)),
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

              <Button onClick={saveMilestone} disabled={saving}>
                {saving ? "Saving..." : editMode ? "Update Milestone" : "Create Milestone"}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-xl font-bold">Delete Milestone</h3>
            <p className="mt-2 text-sm text-muted">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{deleteTarget.title}</span>?
            </p>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button onClick={handleDelete}>Delete</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}