import { NavLink } from "react-router-dom";
import { getUser } from "../services/auth";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Trophy,
  Users,
  ChartBar ,
  Milestone,
  BotMessageSquare,
  ShieldCheck,
  User, UserCog
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

     <div className="flex items-center gap-3 mb-6 px-3 py-2.5 rounded-xl soft-border bg-white/5 dark:bg-white/5">
  {/* Name Section */}
  <div className="flex items-center gap-2 flex-1 min-w-0">
    <User size={16} className="shrink-0 text-[rgb(var(--brand))]" />
    <span className="text-sm font-semibold truncate">
      {user?.fullName}
    </span>
  </div>

  {/* Divider + Role Section */}
  <div className="flex items-center gap-2 shrink-0">
    <span className="h-4 w-px bg-white/20 dark:bg-white/30" />
    <ShieldCheck size={14} className="text-muted" />
    <span className="text-xs font-medium text-muted uppercase tracking-wider">
      {user?.role}
    </span>
  </div>
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
        <NavLink to="/dashboard/milestones"
        className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }>
             <Milestone size={18} />
        Milestones</NavLink>
<NavLink to="/dashboard/chat" className={linkClass}>
 
  <BotMessageSquare size={18} />
  ChatBoard
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
      {
        user?.role === 'ADMIN' && ( <NavLink to="/dashboard/gantt" className={linkClass}>
           <ChartBar  size={18}/>
            Gantt Chart
          </NavLink>)
      }
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