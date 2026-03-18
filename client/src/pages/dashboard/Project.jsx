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
  CalendarDays,
  Flag,
  BarChart3,
  PauseCircle,
  Ban,
  Github,
  Globe,
  FileText,
  MessageSquare,
  FolderOpen,
  Link as LinkIcon,
  RefreshCw,
} from "lucide-react";
import { api } from "../../services/api";
import { getUser } from "../../services/auth";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";

const STATUS_OPTIONS = ["PLANNING", "ACTIVE", "ON_HOLD", "DONE", "CANCELLED"];
const PRIORITY_OPTIONS = ["LOW", "MEDIUM", "HIGH", "URGENT"];

export default function Project() {
  const user = getUser();

  const [projects, setProjects] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [managers, setManagers] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshingProjectId, setRefreshingProjectId] = useState("");

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
    status: "PLANNING",
    priority: "MEDIUM",
    startDate: "",
    endDate: "",
    progress: 0,
    clientName: "",
    githubUrl: "",
    liveUrl: "",
    docsUrl: "",
    figmaUrl: "",
    chatUrl: "",
    driveUrl: "",
    tags: "",
    lastUpdate: "",
  });

  const canCreate = user?.role === "ADMIN" || user?.role === "TEAM_LEADER";
  const canManage =
    user?.role === "ADMIN" ||
    user?.role === "TEAM_LEADER" ||
    user?.role === "PROJECT_MANAGER";
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
      const term = search.toLowerCase();

      const matchesSearch =
        p.name?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term) ||
        p.teamId?.name?.toLowerCase().includes(term) ||
        p.managerId?.fullName?.toLowerCase().includes(term) ||
        p.priority?.toLowerCase().includes(term) ||
        p.status?.toLowerCase().includes(term) ||
        p.clientName?.toLowerCase().includes(term) ||
        (p.tags || []).some((tag) => tag.toLowerCase().includes(term));

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
      status: "PLANNING",
      priority: "MEDIUM",
      startDate: "",
      endDate: "",
      progress: 0,
      clientName: "",
      githubUrl: "",
      liveUrl: "",
      docsUrl: "",
      figmaUrl: "",
      chatUrl: "",
      driveUrl: "",
      tags: "",
      lastUpdate: "",
    });
    setEditMode(false);
    setSelectedProject(null);
  }

  function formatDate(date) {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  }

  function normalizeDateForInput(date) {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  }

  function clampProgress(value) {
    const num = Number(value);
    if (Number.isNaN(num)) return 0;
    return Math.max(0, Math.min(100, num));
  }

  async function handleCreateOrUpdate() {
    try {
      if (!form.name || !form.managerId) {
        alert("Please fill all required fields");
        return;
      }

      setSaving(true);

      const payload = {
        name: form.name,
        description: form.description,
        managerId: form.managerId,
        status: form.status,
        priority: form.priority,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
        progress: clampProgress(form.progress),
        clientName: form.clientName,
        githubUrl: form.githubUrl,
        liveUrl: form.liveUrl,
        docsUrl: form.docsUrl,
        figmaUrl: form.figmaUrl,
        chatUrl: form.chatUrl,
        driveUrl: form.driveUrl,
        tags: form.tags,
        lastUpdate: form.lastUpdate,
      };

      if (editMode && selectedProject) {
        await api.patch(`/projects/${selectedProject._id}`, payload);
      } else {
        await api.post("/projects", payload);
      }

      setOpen(false);
      resetForm();
      await loadProjects();
      if (user?.teamId && (user?.role === "TEAM_LEADER" || user?.role === "ADMIN")) {
        await loadMyTeamAndManagers();
      }
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
      status: project.status || "PLANNING",
      priority: project.priority || "MEDIUM",
      startDate: normalizeDateForInput(project.startDate),
      endDate: normalizeDateForInput(project.endDate),
      progress: Number(project.progress || 0),
      clientName: project.clientName || "",
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      docsUrl: project.docsUrl || "",
      figmaUrl: project.figmaUrl || "",
      chatUrl: project.chatUrl || "",
      driveUrl: project.driveUrl || "",
      tags: Array.isArray(project.tags) ? project.tags.join(", ") : "",
      lastUpdate: project.lastUpdate || "",
    });
    setOpen(true);
  }

  async function handleStatusChange(projectId, status) {
    try {
      await api.patch(`/projects/${projectId}/status`, { status });
      await loadProjects();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update status");
    }
  }

  async function handleDelete() {
    try {
      if (!deleteTarget) return;
      await api.delete(`/projects/${deleteTarget._id}`);
      setDeleteTarget(null);
      await loadProjects();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete project");
    }
  }

  async function refreshProgress(projectId) {
    try {
      setRefreshingProjectId(projectId);
      await api.patch(`/projects/${projectId}/refresh-progress`);
      await loadProjects();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to refresh progress");
    } finally {
      setRefreshingProjectId("");
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
      await loadProjects();
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
    if (status === "PLANNING") {
      return "bg-slate-500/15 text-slate-400 border border-slate-500/20";
    }
    if (status === "ON_HOLD") {
      return "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20";
    }
    if (status === "CANCELLED") {
      return "bg-red-500/15 text-red-400 border border-red-500/20";
    }

    return "border soft-border text-muted";
  }

  function getPriorityClass(priority) {
    if (priority === "URGENT") return "text-red-400 border-red-500/20 bg-red-500/10";
    if (priority === "HIGH") return "text-orange-400 border-orange-500/20 bg-orange-500/10";
    if (priority === "MEDIUM") return "text-yellow-400 border-yellow-500/20 bg-yellow-500/10";
    return "text-emerald-400 border-emerald-500/20 bg-emerald-500/10";
  }

  function nextStatus(project) {
    if (project.status === "PLANNING") return "ACTIVE";
    if (project.status === "ACTIVE") return "DONE";
    if (project.status === "DONE") return "ACTIVE";
    if (project.status === "ON_HOLD") return "ACTIVE";
    if (project.status === "CANCELLED") return "ACTIVE";
    return "ACTIVE";
  }

  function nextStatusLabel(project) {
    if (project.status === "PLANNING") return "Start Project";
    if (project.status === "ACTIVE") return "Mark Done";
    if (project.status === "DONE") return "Mark Active";
    if (project.status === "ON_HOLD") return "Resume Project";
    if (project.status === "CANCELLED") return "Reopen Project";
    return "Update Status";
  }

  function LinkBadge({ href, icon: Icon, label }) {
    if (!href) return null;

    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-full border soft-border px-3 py-1.5 text-xs transition hover:bg-black/5 dark:hover:bg-white/5"
      >
        <Icon size={14} />
        {label}
      </a>
    );
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
              Create projects, add collaboration links, assign managers and members,
              track timelines, monitor progress, and organize real-world teamwork in one workspace.
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
              placeholder="Search by project, team, manager, client, tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {["ALL", ...STATUS_OPTIONS].map((item) => (
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

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
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

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border soft-border p-3">
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <CalendarDays size={14} />
                      Timeline
                    </div>
                    <div className="mt-1 text-sm font-semibold">
                      {formatDate(p.startDate)} → {formatDate(p.endDate)}
                    </div>
                  </div>

                  <div className="rounded-2xl border soft-border p-3">
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <Flag size={14} />
                      Priority
                    </div>
                    <div
                      className={`mt-1 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getPriorityClass(
                        p.priority || "MEDIUM"
                      )}`}
                    >
                      {p.priority || "MEDIUM"}
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border soft-border p-3">
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <UserRound size={14} />
                      Client
                    </div>
                    <div className="mt-1 text-sm font-semibold">
                      {p.clientName || "-"}
                    </div>
                  </div>

                  <div className="rounded-2xl border soft-border p-3">
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <FileText size={14} />
                      Last Update
                    </div>
                    <div className="mt-1 line-clamp-2 text-sm font-semibold">
                      {p.lastUpdate || "-"}
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border soft-border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <BarChart3 size={14} />
                      Progress
                    </div>
                    <div className="text-xs font-semibold">
                      {Number(p.progress || 0)}%
                    </div>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-[rgb(var(--brand))] transition-all"
                      style={{ width: `${Number(p.progress || 0)}%` }}
                    />
                  </div>
                </div>

                {!!p.tags?.length && (
                  <div className="mt-4">
                    <div className="mb-2 flex items-center gap-2 text-xs text-muted">
                      <LinkIcon size={14} />
                      Tags
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {p.tags.map((tag, index) => (
                        <span
                          key={`${p._id}-tag-${index}`}
                          className="rounded-full border soft-border px-3 py-1 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <div className="mb-2 flex items-center gap-2 text-xs text-muted">
                    <LinkIcon size={14} />
                    Collaboration Links
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <LinkBadge href={p.githubUrl} icon={Github} label="GitHub" />
                    <LinkBadge href={p.liveUrl} icon={Globe} label="Live" />
                    <LinkBadge href={p.docsUrl} icon={FileText} label="Docs" />
                    <LinkBadge href={p.figmaUrl} icon={LinkIcon} label="Figma" />
                    <LinkBadge href={p.chatUrl} icon={MessageSquare} label="Chat" />
                    <LinkBadge href={p.driveUrl} icon={FolderOpen} label="Drive" />
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

                  <Button
                    variant="outline"
                    onClick={() => refreshProgress(p._id)}
                    disabled={refreshingProjectId === p._id}
                  >
                    <span className="inline-flex items-center gap-2">
                      <RefreshCw size={15} />
                      {refreshingProjectId === p._id ? "Refreshing..." : "Refresh Progress"}
                    </span>
                  </Button>

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
                        onClick={() => handleStatusChange(p._id, nextStatus(p))}
                      >
                        {p.status === "ON_HOLD" && (
                          <span className="inline-flex items-center gap-2">
                            <PauseCircle size={15} />
                            {nextStatusLabel(p)}
                          </span>
                        )}

                        {p.status === "CANCELLED" && (
                          <span className="inline-flex items-center gap-2">
                            <Ban size={15} />
                            {nextStatusLabel(p)}
                          </span>
                        )}

                        {p.status !== "ON_HOLD" &&
                          p.status !== "CANCELLED" &&
                          nextStatusLabel(p)}
                      </Button>

                      {(user?.role === "ADMIN" || user?.role === "TEAM_LEADER") && (
                        <Button
                          variant="outline"
                          onClick={() => setDeleteTarget(p)}
                        >
                          <span className="inline-flex items-center gap-2">
                            <Trash2 size={15} />
                            Delete
                          </span>
                        </Button>
                      )}
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
          <Card className="w-full max-w-3xl p-0 overflow-hidden max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b soft-border px-6 py-4">
              <div>
                <h2 className="text-xl font-black">
                  {editMode ? "Edit Project" : "Create Project"}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {editMode
                    ? "Update project information, collaboration links, timeline, and manager."
                    : "Set up a new project with timeline, priority, and collaboration links."}
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

              <div className="grid gap-4 sm:grid-cols-2">
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

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-medium text-muted">
                    Status
                  </label>
                  <select
                    className="w-full rounded-2xl border soft-border bg-[rgb(var(--card))] px-4 py-3 text-[rgb(var(--fg))] outline-none focus:ring-2 focus:ring-[rgb(var(--brand))]/20"
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-muted">
                    Priority
                  </label>
                  <select
                    className="w-full rounded-2xl border soft-border bg-[rgb(var(--card))] px-4 py-3 text-[rgb(var(--fg))] outline-none focus:ring-2 focus:ring-[rgb(var(--brand))]/20"
                    value={form.priority}
                    onChange={(e) =>
                      setForm({ ...form, priority: e.target.value })
                    }
                  >
                    {PRIORITY_OPTIONS.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-medium text-muted">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={form.startDate}
                    onChange={(e) =>
                      setForm({ ...form, startDate: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-muted">
                    End Date
                  </label>
                  <Input
                    type="date"
                    value={form.endDate}
                    onChange={(e) =>
                      setForm({ ...form, endDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-muted">
                  Progress ({clampProgress(form.progress)}%)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={form.progress}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      progress: clampProgress(e.target.value),
                    })
                  }
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  placeholder="Client name"
                  value={form.clientName}
                  onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                />

                <Input
                  placeholder="Tags (comma separated)"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                />
              </div>

              <Input
                placeholder="Last update"
                value={form.lastUpdate}
                onChange={(e) => setForm({ ...form, lastUpdate: e.target.value })}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  placeholder="GitHub URL"
                  value={form.githubUrl}
                  onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                />

                <Input
                  placeholder="Live URL"
                  value={form.liveUrl}
                  onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                />

                <Input
                  placeholder="Docs URL"
                  value={form.docsUrl}
                  onChange={(e) => setForm({ ...form, docsUrl: e.target.value })}
                />

                <Input
                  placeholder="Figma URL"
                  value={form.figmaUrl}
                  onChange={(e) => setForm({ ...form, figmaUrl: e.target.value })}
                />

                <Input
                  placeholder="Chat URL"
                  value={form.chatUrl}
                  onChange={(e) => setForm({ ...form, chatUrl: e.target.value })}
                />

                <Input
                  placeholder="Drive URL"
                  value={form.driveUrl}
                  onChange={(e) => setForm({ ...form, driveUrl: e.target.value })}
                />
              </div>
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