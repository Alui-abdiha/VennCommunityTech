import { useEffect, useMemo, useState } from "react";
import {
  FolderKanban,
  Search,
  Plus,
  Users,
  UserRound,
  ShieldCheck,
  Pencil,
  Trash2,
  CheckCircle2,
  Clock3,
  Layers3,
  X,
} from "lucide-react";
import { api } from "../../services/api";
import { getUser } from "../../services/auth";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";

export default function Project() {
  const user = getUser();

  const [projects, setProjects] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [managers, setManagers] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    managerId: "",
  });

  const canCreate = user?.role === "ADMIN" || user?.role === "TEAM_LEADER";
  const canManage = user?.role === "ADMIN" || user?.role === "TEAM_LEADER";
  const canAssign =
    user?.role === "ADMIN" ||
    user?.role === "TEAM_LEADER" ||
    user?.role === "PROJECT_MANAGER";

  async function loadProjects() {
    try {
      setLoading(true);
      const res = await api.get("/projects");
      setProjects(res.data.projects || []);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to load projects");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadMyTeamAndManagers() {
    try {
      if (!user?.teamId) {
        setTeamName("");
        setManagers([]);
        return;
      }

      const teamsRes = await api.get("/teams");
      const teams = teamsRes.data.teams || [];
      const myTeam = teams.find((t) => String(t._id) === String(user.teamId));
      setTeamName(myTeam?.name || "");

      const managersRes = await api.get(
        `/projects/team/${user.teamId}/assignable-managers`
      );
      setManagers(managersRes.data.users || []);
    } catch (err) {
      setManagers([]);
      alert(err?.response?.data?.message || "Failed to load team data");
    }
  }

  async function loadMembersForProject(project) {
    try {
      if (!project?.teamId?._id) {
        setTeamMembers([]);
        return;
      }

      const res = await api.get(
        `/projects/team/${project.teamId._id}/assignable-members`
      );
      setTeamMembers(res.data.users || []);
    } catch (err) {
      setTeamMembers([]);
      alert(err?.response?.data?.message || "Failed to load team members");
    }
  }

  useEffect(() => {
    loadProjects();
    if (user?.teamId && (user?.role === "TEAM_LEADER" || user?.role === "ADMIN")) {
      loadMyTeamAndManagers();
    }
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase()) ||
        p.teamId?.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.managerId?.fullName?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ? true : p.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: projects.length,
      active: projects.filter((p) => p.status === "ACTIVE").length,
      done: projects.filter((p) => p.status === "DONE").length,
      members: projects.reduce((acc, p) => acc + (p.members?.length || 0), 0),
    };
  }, [projects]);

  function resetForm() {
    setForm({
      name: "",
      description: "",
      managerId: "",
    });
    setEditMode(false);
    setSelectedProject(null);
  }

  async function handleCreateOrUpdate() {
    try {
      if (!form.name || !form.managerId) {
        alert("Please fill all required fields");
        return;
      }

      setSaving(true);

      if (editMode && selectedProject) {
        await api.patch(`/projects/${selectedProject._id}`, {
          name: form.name,
          description: form.description,
          managerId: form.managerId,
        });
      } else {
        await api.post("/projects", {
          name: form.name,
          description: form.description,
          managerId: form.managerId,
        });
      }

      setOpen(false);
      resetForm();
      await loadProjects();
      await loadMyTeamAndManagers();
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          (editMode ? "Update project failed" : "Create project failed")
      );
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(project) {
    setEditMode(true);
    setSelectedProject(project);
    setForm({
      name: project.name || "",
      description: project.description || "",
      managerId: project.managerId?._id || "",
    });
    setOpen(true);
  }

  async function handleStatusChange(projectId, status) {
    try {
      await api.patch(`/projects/${projectId}/status`, { status });
      loadProjects();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update status");
    }
  }

  async function handleDelete() {
    try {
      if (!deleteTarget) return;
      await api.delete(`/projects/${deleteTarget._id}`);
      setDeleteTarget(null);
      loadProjects();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete project");
    }
  }

  async function openAssignModal(project) {
    setSelectedProject(project);
    setSelectedMembers((project.members || []).map((m) => m._id));
    await loadMembersForProject(project);
    setAssignOpen(true);
  }

  function toggleMember(memberId) {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  }

  async function saveAssignedMembers() {
    try {
      if (!selectedProject) return;

      await api.patch(`/projects/${selectedProject._id}/members`, {
        members: selectedMembers,
      });

      setAssignOpen(false);
      setSelectedProject(null);
      setSelectedMembers([]);
      loadProjects();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to assign members");
    }
  }

  function getStatusClass(status) {
    if (status === "ACTIVE") {
      return "bg-[rgb(var(--brand))]/15 text-[rgb(var(--brand))] border border-[rgb(var(--brand))]/20";
    }

    if (status === "DONE") {
      return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20";
    }

    return "border soft-border text-muted";
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border soft-border p-6 md:p-8 bg-[radial-gradient(circle_at_top_right,rgba(var(--brand),0.16),transparent_30%),linear-gradient(to_bottom_right,rgba(255,255,255,0.02),rgba(255,255,255,0.01))]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border soft-border px-3 py-1 text-xs text-muted">
              <Layers3 size={14} />
              Project Workspace
            </div>

            <h1 className="mt-4 text-3xl md:text-4xl font-black tracking-tight">
              Project Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-muted">
              Create projects, assign managers and members, update status, and
              keep the whole team organized in one clean workspace.
            </p>
          </div>

          {canCreate && (
            <Button
              onClick={() => {
                resetForm();
                setOpen(true);
              }}
              className="inline-flex items-center gap-2"
            >
              <Plus size={18} />
              New Project
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-muted">Total Projects</div>
              <div className="mt-2 text-3xl font-black">{stats.total}</div>
            </div>
            <div className="rounded-2xl border soft-border p-3">
              <FolderKanban className="h-5 w-5 text-[rgb(var(--brand))]" />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-muted">Active</div>
              <div className="mt-2 text-3xl font-black">{stats.active}</div>
            </div>
            <div className="rounded-2xl border soft-border p-3">
              <Clock3 className="h-5 w-5 text-[rgb(var(--brand))]" />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-muted">Completed</div>
              <div className="mt-2 text-3xl font-black">{stats.done}</div>
            </div>
            <div className="rounded-2xl border soft-border p-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-muted">Assigned Members</div>
              <div className="mt-2 text-3xl font-black">{stats.members}</div>
            </div>
            <div className="rounded-2xl border soft-border p-3">
              <Users className="h-5 w-5 text-[rgb(var(--brand))]" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-4 md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              className="w-full rounded-2xl border soft-border bg-transparent py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-[rgb(var(--brand))]/20"
              placeholder="Search by project, team, manager..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {["ALL", "ACTIVE", "DONE"].map((item) => (
              <button
                key={item}
                onClick={() => setStatusFilter(item)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  statusFilter === item
                    ? "bg-[rgb(var(--brand))] text-white"
                    : "border soft-border text-muted hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {loading ? (
        <Card className="p-10 text-center text-sm text-muted">
          Loading projects...
        </Card>
      ) : filteredProjects.length === 0 ? (
        <Card className="p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border soft-border">
            <FolderKanban className="h-8 w-8 text-[rgb(var(--brand))]" />
          </div>
          <h3 className="mt-4 text-xl font-bold">No matching projects</h3>
          <p className="mt-2 text-sm text-muted">
            Try changing your search or filter, or create a new project.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {filteredProjects.map((p) => (
            <Card
              key={p._id}
              className="group overflow-hidden p-0 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="h-1 w-full bg-gradient-to-r from-[rgb(var(--brand))] to-purple-500" />

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border soft-border">
                      <FolderKanban className="h-5 w-5 text-[rgb(var(--brand))]" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-black">{p.name}</h3>
                      <div className="mt-1 text-xs text-muted">
                        Team: {p.teamId?.name || "-"}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                      p.status
                    )}`}
                  >
                    {p.status}
                  </span>
                </div>

                {p.description ? (
                  <p className="mt-4 line-clamp-2 text-sm text-muted">
                    {p.description}
                  </p>
                ) : (
                  <p className="mt-4 text-sm italic text-muted">
                    No description provided.
                  </p>
                )}

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border soft-border p-3">
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <ShieldCheck size={14} />
                      Team Leader
                    </div>
                    <div className="mt-1 text-sm font-semibold">
                      {p.leaderId?.fullName || "-"}
                    </div>
                  </div>

                  <div className="rounded-2xl border soft-border p-3">
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <UserRound size={14} />
                      Project Manager
                    </div>
                    <div className="mt-1 text-sm font-semibold">
                      {p.managerId?.fullName || "-"}
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center gap-2 text-xs text-muted">
                    <Users size={14} />
                    Members ({p.members?.length || 0})
                  </div>

                  {p.members?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {p.members.slice(0, 5).map((m) => (
                        <span
                          key={m._id}
                          className="rounded-full border soft-border px-3 py-1 text-xs"
                        >
                          {m.fullName}
                        </span>
                      ))}
                      {p.members.length > 5 && (
                        <span className="rounded-full border soft-border px-3 py-1 text-xs text-muted">
                          +{p.members.length - 5} more
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-muted">No members assigned yet.</div>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {canAssign && (
                    <Button onClick={() => openAssignModal(p)}>
                      Assign Members
                    </Button>
                  )}

                  {canManage && (
                    <>
                      <Button variant="outline" onClick={() => handleEdit(p)}>
                        <span className="inline-flex items-center gap-2">
                          <Pencil size={15} />
                          Edit
                        </span>
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() =>
                          handleStatusChange(
                            p._id,
                            p.status === "ACTIVE" ? "DONE" : "ACTIVE"
                          )
                        }
                      >
                        {p.status === "ACTIVE" ? "Mark Done" : "Mark Active"}
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => setDeleteTarget(p)}
                      >
                        <span className="inline-flex items-center gap-2">
                          <Trash2 size={15} />
                          Delete
                        </span>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-xl p-0 overflow-hidden">
            <div className="flex items-center justify-between border-b soft-border px-6 py-4">
              <div>
                <h2 className="text-xl font-black">
                  {editMode ? "Edit Project" : "Create Project"}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {editMode
                    ? "Update project information and manager."
                    : "Set up a new project and assign a manager."}
                </p>
              </div>

              <button
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
                className="rounded-xl border soft-border p-2 text-muted transition hover:bg-black/5 dark:hover:bg-white/5"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <Input
                placeholder="Project name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <textarea
                rows={4}
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full rounded-2xl border soft-border bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-[rgb(var(--brand))]/20"
              />

              <Input placeholder="Team" value={teamName} readOnly />

              <select
                className="w-full rounded-2xl border soft-border bg-[rgb(var(--card))] px-4 py-3 text-[rgb(var(--fg))] outline-none focus:ring-2 focus:ring-[rgb(var(--brand))]/20"
                value={form.managerId}
                onChange={(e) => setForm({ ...form, managerId: e.target.value })}
              >
                <option value="">Select project manager</option>
                {managers.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 border-t soft-border px-6 py-4">
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateOrUpdate} disabled={saving}>
                {saving
                  ? editMode
                    ? "Updating..."
                    : "Creating..."
                  : editMode
                  ? "Update Project"
                  : "Create Project"}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {assignOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-2xl p-0 overflow-hidden">
            <div className="flex items-center justify-between border-b soft-border px-6 py-4">
              <div>
                <h2 className="text-xl font-black">Assign Members</h2>
                <p className="mt-1 text-sm text-muted">
                  {selectedProject?.name || "Project"}
                </p>
              </div>

              <button
                onClick={() => {
                  setAssignOpen(false);
                  setSelectedProject(null);
                  setSelectedMembers([]);
                }}
                className="rounded-xl border soft-border p-2 text-muted transition hover:bg-black/5 dark:hover:bg-white/5"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              {teamMembers.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {teamMembers.map((m) => (
                    <label
                      key={m._id}
                      className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition ${
                        selectedMembers.includes(m._id)
                          ? "border-[rgb(var(--brand))]/40 bg-[rgb(var(--brand))]/10"
                          : "soft-border hover:bg-black/5 dark:hover:bg-white/5"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(m._id)}
                        onChange={() => toggleMember(m._id)}
                        className="h-4 w-4 accent-[rgb(var(--brand))]"
                      />

                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">
                          {m.fullName}
                        </div>
                        <div className="truncate text-xs text-muted">
                          {m.email}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border soft-border p-8 text-center text-sm text-muted">
                  No team members available for this project.
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 border-t soft-border px-6 py-4">
              <Button
                variant="outline"
                onClick={() => {
                  setAssignOpen(false);
                  setSelectedProject(null);
                  setSelectedMembers([]);
                }}
              >
                Cancel
              </Button>
              <Button onClick={saveAssignedMembers}>Save Members</Button>
            </div>
          </Card>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-xl font-black">Delete Project</h3>
            <p className="mt-2 text-sm text-muted">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-[rgb(var(--fg))]">
                {deleteTarget.name}
              </span>
              ? This action cannot be undone.
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