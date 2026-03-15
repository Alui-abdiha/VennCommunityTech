import { useEffect, useMemo, useState } from "react";
import {
  Users,
  Briefcase,
  ShieldCheck,
  FolderKanban,
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { api } from "../../services/api";
import { getUser } from "../../services/auth";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

export default function Teams() {
  const user = getUser();
  const isAdmin = user?.role === "ADMIN";

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const [open, setOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [details, setDetails] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  async function loadTeams() {
    try {
      setLoading(true);
      const res = await api.get("/teams");
      setTeams(res.data.teams || []);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to load teams");
    } finally {
      setLoading(false);
    }
  }

  async function openDetails(team) {
    try {
      const res = await api.get(`/teams/${team._id}`);
      setDetails(res.data);
      setDetailsOpen(true);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to load team details");
    }
  }

  function openCreateModal() {
    setEditingTeam(null);
    setForm({ name: "", description: "" });
    setOpen(true);
  }

  function openEditModal(team) {
    setEditingTeam(team);
    setForm({
      name: team.name || "",
      description: team.description || "",
    });
    setOpen(true);
  }

  async function handleSubmit() {
    try {
      if (!form.name.trim()) {
        alert("Team name is required");
        return;
      }

      if (editingTeam) {
        await api.patch(`/teams/${editingTeam._id}`, form);
      } else {
        await api.post("/teams", form);
      }

      setOpen(false);
      setEditingTeam(null);
      setForm({ name: "", description: "" });
      loadTeams();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to save team");
    }
  }

  async function handleDelete(team) {
    const ok = window.confirm(`Delete "${team.name}"?`);
    if (!ok) return;

    try {
      await api.delete(`/teams/${team._id}`);
      loadTeams();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete team");
    }
  }

  useEffect(() => {
    loadTeams();
  }, []);

  const filteredTeams = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return teams;

    return teams.filter(
      (t) =>
        t.name?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q)
    );
  }, [teams, query]);

  const totals = useMemo(() => {
    return teams.reduce(
      (acc, team) => {
        acc.teams += 1;
        acc.members += team.stats?.membersCount || 0;
        acc.managers += team.stats?.managersCount || 0;
        acc.projects += team.stats?.projectsCount || 0;
        return acc;
      },
      { teams: 0, members: 0, managers: 0, projects: 0 }
    );
  }, [teams]);

  const statsCards = [
    {
      label: "Total Teams",
      value: totals.teams,
      icon: Users,
    },
    {
      label: "Members",
      value: totals.members,
      icon: Briefcase,
    },
    {
      label: "Managers",
      value: totals.managers,
      icon: ShieldCheck,
    },
    {
      label: "Projects",
      value: totals.projects,
      icon: FolderKanban,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Team Management</h1>
          <p className="mt-1 text-sm text-muted">
            Create, update, view, and manage teams with a clean administrative dashboard.
          </p>
        </div>

        {isAdmin && (
          <Button onClick={openCreateModal} className="inline-flex items-center gap-2">
            <Plus size={18} />
            New Team
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsCards.map((item) => {
          const Icon = item.icon;
          return (
            <Card
              key={item.label}
              className="p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">{item.label}</p>
                  <h2 className="mt-2 text-3xl font-black">{item.value}</h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border soft-border">
                  <Icon className="h-5 w-5 text-[rgb(var(--brand))]" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            placeholder="Search teams by name or description..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Teams Grid */}
      {loading ? (
        <div className="text-sm text-muted">Loading teams...</div>
      ) : filteredTeams.length === 0 ? (
        <Card className="p-10 text-center">
          <h3 className="text-xl font-bold">No teams found</h3>
          <p className="mt-2 text-sm text-muted">
            Create a team or change your search.
          </p>
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredTeams.map((team) => (
            <Card
              key={team._id}
              className="group p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">{team.name}</h2>
                  <p className="mt-2 text-sm text-muted line-clamp-2">
                    {team.description || "No description provided."}
                  </p>
                </div>

                <div className="rounded-xl border soft-border px-2 py-1 text-xs text-muted">
                  Team
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border soft-border p-3">
                  <div className="text-xs text-muted">Members</div>
                  <div className="mt-1 text-xl font-black">
                    {team.stats?.membersCount || 0}
                  </div>
                </div>

                <div className="rounded-2xl border soft-border p-3">
                  <div className="text-xs text-muted">Managers</div>
                  <div className="mt-1 text-xl font-black">
                    {team.stats?.managersCount || 0}
                  </div>
                </div>

                <div className="rounded-2xl border soft-border p-3">
                  <div className="text-xs text-muted">Leaders</div>
                  <div className="mt-1 text-xl font-black">
                    {team.stats?.leadersCount || 0}
                  </div>
                </div>

                <div className="rounded-2xl border soft-border p-3">
                  <div className="text-xs text-muted">Projects</div>
                  <div className="mt-1 text-xl font-black">
                    {team.stats?.projectsCount || 0}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => openDetails(team)}
                >
                  View Details
                </Button>

                {isAdmin && (
                  <>
                    <Button
                      className="inline-flex items-center gap-2"
                      onClick={() => openEditModal(team)}
                    >
                      <Pencil size={16} />
                      Edit
                    </Button>

                    <Button
                      variant="outline"
                      className="inline-flex items-center gap-2"
                      onClick={() => handleDelete(team)}
                    >
                      <Trash2 size={16} />
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-lg p-6">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  {editingTeam ? "Edit Team" : "Create Team"}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {editingTeam
                    ? "Update team information."
                    : "Add a new team to your organization."}
                </p>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="rounded-xl border soft-border p-2"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <Input
                placeholder="Team name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <Input
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingTeam ? "Update Team" : "Create Team"}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Details Modal */}
      {detailsOpen && details && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-3xl p-6">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-black">{details.team?.name}</h2>
                <p className="mt-1 text-sm text-muted">
                  {details.team?.description || "No description"}
                </p>
              </div>

              <button
                onClick={() => {
                  setDetailsOpen(false);
                  setDetails(null);
                }}
                className="rounded-xl border soft-border p-2"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Card className="p-4">
                <div className="text-sm text-muted">Members</div>
                <div className="mt-2 text-2xl font-black">
                  {details.stats?.membersCount || 0}
                </div>
              </Card>

              <Card className="p-4">
                <div className="text-sm text-muted">Managers</div>
                <div className="mt-2 text-2xl font-black">
                  {details.stats?.managersCount || 0}
                </div>
              </Card>

              <Card className="p-4">
                <div className="text-sm text-muted">Leaders</div>
                <div className="mt-2 text-2xl font-black">
                  {details.stats?.leadersCount || 0}
                </div>
              </Card>

              <Card className="p-4">
                <div className="text-sm text-muted">Projects</div>
                <div className="mt-2 text-2xl font-black">
                  {details.stats?.projectsCount || 0}
                </div>
              </Card>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <Card className="p-4">
                <h3 className="font-bold">Managers</h3>
                <div className="mt-3 space-y-2">
                  {(details.managers || []).length > 0 ? (
                    details.managers.map((u) => (
                      <div
                        key={u._id}
                        className="rounded-xl border soft-border p-3 text-sm"
                      >
                        <div className="font-medium">{u.fullName}</div>
                        <div className="text-muted">{u.email}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted">No managers</div>
                  )}
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-bold">Members</h3>
                <div className="mt-3 max-h-64 space-y-2 overflow-y-auto">
                  {(details.members || []).length > 0 ? (
                    details.members.map((u) => (
                      <div
                        key={u._id}
                        className="rounded-xl border soft-border p-3 text-sm"
                      >
                        <div className="font-medium">{u.fullName}</div>
                        <div className="text-muted">{u.email}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted">No members</div>
                  )}
                </div>
              </Card>
            </div>

            <div className="mt-6">
              <Card className="p-4">
                <h3 className="font-bold">Projects</h3>
                <div className="mt-3 space-y-2">
                  {(details.projects || []).length > 0 ? (
                    details.projects.map((p) => (
                      <div
                        key={p._id}
                        className="rounded-xl border soft-border p-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="font-medium">{p.name}</div>
                            <div className="text-xs text-muted mt-1">
                              Leader: {p.leaderId?.fullName || "-"} • Manager:{" "}
                              {p.managerId?.fullName || "-"}
                            </div>
                          </div>

                          <span className="rounded-full border soft-border px-3 py-1 text-xs text-muted">
                            {p.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted">No projects</div>
                  )}
                </div>
              </Card>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}