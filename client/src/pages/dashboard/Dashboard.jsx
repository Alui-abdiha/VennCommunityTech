import { useEffect, useMemo, useState } from "react";
import {
  FolderKanban,
  CheckSquare,
  Trophy,
  Users,
  AlertTriangle,
  Activity,
  CalendarRange,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";
import { api } from "../../services/api";
import { getUser } from "../../services/auth";
import Card from "../../components/ui/Card";

const statItems = [
  { key: "projects", label: "Projects", icon: FolderKanban },
  { key: "tasks", label: "Tasks", icon: CheckSquare },
  { key: "points", label: "My Points", icon: Trophy },
  { key: "activeMembers", label: "Active Members", icon: Users },
];

const timelineSteps = [
  { id: 1, title: "Start", note: "Release start" },
  { id: 2, title: "Sprint 1", note: "Initial work" },
  { id: 3, title: "Sprint 2", note: "Core build" },
  { id: 4, title: "Sprint 3", note: "Testing" },
  { id: 5, title: "Finish", note: "Delivery" },
];

const demoActivities = [
  { name: "Activity 1", description: "Member tasks in progress" },
  { name: "Activity 2", description: "New submissions waiting review" },
  { name: "Activity 3", description: "Project updates from managers" },
  { name: "Activity 4", description: "Team coordination ongoing" },
  { name: "Activity 5", description: "Daily work tracking active" },
];

const demoIssues = [
  { rank: "#1", issue: "Pending confirmations" },
  { rank: "#2", issue: "Workload imbalance" },
  { rank: "#3", issue: "Delayed sprint items" },
  { rank: "#4", issue: "Member availability" },
  { rank: "#5", issue: "Scope clarification needed" },
];

const demoRisks = [
  { name: "Risk 1", impact: "Low", probability: "Medium" },
  { name: "Risk 2", impact: "Medium", probability: "High" },
  { name: "Risk 3", impact: "High", probability: "Low" },
  { name: "Risk 4", impact: "Low", probability: "Medium" },
  { name: "Risk 5", impact: "Medium", probability: "High" },
];

function RiskCell({ value }) {
  let cls =
    "bg-slate-500/15 text-slate-300 border border-white/10";

  if (value === "Low") {
    cls = "bg-sky-500/15 text-sky-300 border border-sky-500/20";
  } else if (value === "Medium") {
    cls = "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20";
  } else if (value === "High") {
    cls = "bg-orange-500/15 text-orange-300 border border-orange-500/20";
  }

  return (
    <span className={`inline-flex min-w-[72px] justify-center rounded-md px-2 py-1 text-[11px] font-semibold ${cls}`}>
      {value}
    </span>
  );
}

export default function Dashboard() {
  const user = getUser();

  const [stats, setStats] = useState({
    projects: 0,
    tasks: 0,
    points: 0,
    activeMembers: 0,
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/stats/dashboard");
        setStats(res.data.stats || {});
      } catch (error) {
        console.error("Failed to load dashboard stats:", error);
      }
    })();
  }, []);

  const roleMeta = useMemo(() => {
    switch (user?.role) {
      case "ADMIN":
        return {
          title: "Project Dashboard",
          sub: "System overview",
          status: "Healthy",
          progress: 82,
        };
      case "TEAM_LEADER":
        return {
          title: "Project Dashboard",
          sub: "Team overview",
          status: "Active",
          progress: 74,
        };
      case "PROJECT_MANAGER":
        return {
          title: "Project Dashboard",
          sub: "Project overview",
          status: "In Progress",
          progress: 68,
        };
      default:
        return {
          title: "Project Dashboard",
          sub: "Personal overview",
          status: "Ongoing",
          progress: 61,
        };
    }
  }, [user?.role]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="grid gap-3 lg:grid-cols-12">
        <Card className="lg:col-span-4 p-4">
          <h1 className="text-2xl font-extrabold tracking-tight">
            {roleMeta.title}
          </h1>
          <p className="mt-1 text-sm text-muted uppercase tracking-wide">
            {roleMeta.sub}
          </p>
        </Card>

        <Card className="lg:col-span-3 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Overall Status</p>
            <CheckCircle2 className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <span className="inline-flex rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-400 border border-amber-500/20">
              {roleMeta.status}
            </span>
          </div>
        </Card>

        <Card className="lg:col-span-5 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Overall Progress</p>
            <span className="text-sm font-bold">{roleMeta.progress}%</span>
          </div>
          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-yellow-500"
              style={{ width: `${roleMeta.progress}%` }}
            />
          </div>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statItems.map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.key} className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-muted">{item.label}</p>
                  <h2 className="mt-1 text-2xl font-extrabold">
                    {stats[item.key] ?? 0}
                  </h2>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl border soft-border bg-[rgb(var(--brand))]/10">
                  <Icon className="h-4 w-4 text-[rgb(var(--brand))]" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Main content */}
      <div className="grid gap-3 xl:grid-cols-12">
        {/* Ongoing Activities */}
        <Card className="xl:col-span-4 p-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgb(var(--brand))]/10 border soft-border">
              <Activity className="h-4 w-4 text-[rgb(var(--brand))]" />
            </div>
            <h2 className="text-lg font-bold">Ongoing Activities</h2>
          </div>

          <div className="overflow-hidden rounded-xl border soft-border">
            <table className="w-full text-xs">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Name</th>
                  <th className="px-3 py-2 text-left font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                {demoActivities.map((item, index) => (
                  <tr key={index} className="border-t border-white/10">
                    <td className="px-3 py-2">{item.name}</td>
                    <td className="px-3 py-2 text-muted">{item.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Timeline */}
        <Card className="xl:col-span-8 p-4">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgb(var(--brand))]/10 border soft-border">
              <CalendarRange className="h-4 w-4 text-[rgb(var(--brand))]" />
            </div>
            <h2 className="text-lg font-bold">Project Timeline</h2>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {timelineSteps.map((step, index) => (
              <div key={step.id} className="text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/20 text-sm font-bold">
                  {index + 1}
                </div>
                <div className="mt-2 text-sm font-semibold">{step.title}</div>
                <div className="mt-1 text-xs text-muted">{step.note}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Issues */}
        <Card className="xl:col-span-4 p-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgb(var(--brand))]/10 border soft-border">
              <AlertTriangle className="h-4 w-4 text-[rgb(var(--brand))]" />
            </div>
            <h2 className="text-lg font-bold">Top 5 Issues</h2>
          </div>

          <div className="overflow-hidden rounded-xl border soft-border">
            <table className="w-full text-xs">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Rank</th>
                  <th className="px-3 py-2 text-left font-semibold">Issue</th>
                </tr>
              </thead>
              <tbody>
                {demoIssues.map((item, index) => (
                  <tr key={index} className="border-t border-white/10">
                    <td className="px-3 py-2 font-semibold">{item.rank}</td>
                    <td className="px-3 py-2 text-muted">{item.issue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Burndown */}
        <Card className="xl:col-span-4 p-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgb(var(--brand))]/10 border soft-border">
              <CheckSquare className="h-4 w-4 text-[rgb(var(--brand))]" />
            </div>
            <h2 className="text-lg font-bold">Burndown</h2>
          </div>

          <div className="flex h-[180px] items-end gap-3 rounded-xl border soft-border p-3">
            {[32, 28, 24, 18, 30].map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-md bg-[rgb(var(--brand))]/70"
                  style={{ height: `${v * 4}px` }}
                />
                <span className="text-[11px] text-muted">{i + 1}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Risks */}
        <Card className="xl:col-span-4 p-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgb(var(--brand))]/10 border soft-border">
              <ShieldAlert className="h-4 w-4 text-[rgb(var(--brand))]" />
            </div>
            <h2 className="text-lg font-bold">Risks</h2>
          </div>

          <div className="overflow-hidden rounded-xl border soft-border">
            <table className="w-full text-xs">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Risk Name</th>
                  <th className="px-3 py-2 text-left font-semibold">Impact</th>
                  <th className="px-3 py-2 text-left font-semibold">Probability</th>
                </tr>
              </thead>
              <tbody>
                {demoRisks.map((risk, index) => (
                  <tr key={index} className="border-t border-white/10">
                    <td className="px-3 py-2 text-muted">{risk.name}</td>
                    <td className="px-3 py-2">
                      <RiskCell value={risk.impact} />
                    </td>
                    <td className="px-3 py-2">
                      <RiskCell value={risk.probability} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}