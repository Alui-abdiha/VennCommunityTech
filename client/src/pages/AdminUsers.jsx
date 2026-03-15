import { useEffect, useState } from "react";
import { api } from "../services/api";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const roles = ["ADMIN", "TEAM_LEADER", "PROJECT_MANAGER", "MEMBER"];
const statuses = ["PENDING", "APPROVED", "DENIED"];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      const [usersRes, teamsRes] = await Promise.all([
        api.get("/admin/users"),
        api.get("/teams"),
      ]);

      setUsers(usersRes.data.users || []);
      setTeams(teamsRes.data.teams || []);
      setError("");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, status) {
    await api.patch(`/admin/users/${id}/status`, { status });
    load();
  }

  async function updateRole(id, role) {
    await api.patch(`/admin/users/${id}/role`, { role });
    load();
  }

  async function updateTeam(id, teamId) {
    await api.patch(`/admin/users/${id}/team`, { teamId: teamId || null });
    load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Manage Users</h1>
        <p className="mt-1 text-sm text-muted">
          Approve users, assign roles, and assign teams.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border soft-border card-bg px-4 py-3 text-sm">
          <span className="font-semibold">Error:</span> {error}
        </div>
      )}

      {loading ? (
        <div className="text-sm text-muted">Loading users...</div>
      ) : (
        <div className="space-y-4">
          {users.map((u) => (
            <Card key={u._id} className="p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <div className="text-base font-bold">{u.fullName}</div>
                  <div className="text-sm text-muted break-all">{u.email}</div>
                  <div className="mt-1 text-xs text-muted">
                    Team: {u.teamId?.name || "None"} • Role: {u.role} • Status: {u.status}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <select
                    name="status"
                    className="rounded-xl border soft-border bg-[rgb(var(--card))] px-3 py-2 text-[rgb(var(--fg))] outline-none focus:ring-2 focus:ring-[rgb(var(--brand))]/20"
                    value={u.status}
                    onChange={(e) => updateStatus(u._id, e.target.value)}
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>

                  <select
                    name="role"
                    className="rounded-xl border soft-border bg-[rgb(var(--card))] px-3 py-2 text-[rgb(var(--fg))] outline-none focus:ring-2 focus:ring-[rgb(var(--brand))]/20"
                    value={u.role}
                    onChange={(e) => updateRole(u._id, e.target.value)}
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>

                  <select
                    name="team"
                    className="rounded-xl border soft-border bg-[rgb(var(--card))] px-3 py-2 text-[rgb(var(--fg))] outline-none focus:ring-2 focus:ring-[rgb(var(--brand))]/20"
                    value={u.teamId?._id || ""}
                    onChange={(e) => updateTeam(u._id, e.target.value)}
                  >
                    <option value="">No Team</option>
                    {teams.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={() => updateStatus(u._id, "APPROVED")}>
                  Approve
                </Button>

                <Button
                  variant="outline"
                  onClick={() => updateStatus(u._id, "DENIED")}
                >
                  Deny
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}