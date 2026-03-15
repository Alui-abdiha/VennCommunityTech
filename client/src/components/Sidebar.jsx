import { NavLink } from "react-router-dom";
import { getUser } from "../services/auth";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Trophy,
  Users,
  ShieldCheck
} from "lucide-react";

export default function Sidebar() {
  const user = getUser();

  const linkClass =
    "flex items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium transition hover:bg-black/5 dark:hover:bg-white/10";

  const activeClass =
    "bg-[rgb(var(--brand))]/10 text-[rgb(var(--brand))]";

  return (
    <aside className="w-64 p-4 soft-border border-r">
      
      <div className="font-black text-lg mb-2">Menu</div>

      <div className="text-muted text-sm mb-6">
        {user?.fullName} • {user?.role}
      </div>

      <nav className="space-y-2">

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

       { (user.role ==="ADMIN" || user.role ==="TEAM_LEADER") &&

       ( <NavLink
          to="/dashboard/projects"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <FolderKanban size={18} />
          Projects
        </NavLink>)}

        <NavLink
          to="/dashboard/tasks"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <CheckSquare size={18} />
          Tasks
        </NavLink>

        <NavLink
          to="/dashboard/leaderboard"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <Trophy size={18} />
          Leaderboard
        </NavLink>

        {user?.role === "ADMIN" && (
          <NavLink
            to="/dashboard/teams"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <Users size={18} />
            Teams
          </NavLink>
        )}

        {user?.role === "ADMIN" && (
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <ShieldCheck size={18} />
            Approve Users
          </NavLink>
        )}

      </nav>
    </aside>
  );
}