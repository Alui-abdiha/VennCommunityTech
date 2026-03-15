import { Link, useNavigate } from "react-router-dom";
import { getUser, logout, isAuthed } from "../services/auth";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Navbar() {
  const nav = useNavigate();
  const authed = isAuthed();
  const user = getUser();

  function onLogout() {
    logout();
    nav("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b soft-border bg-[rgb(var(--bg))]/70 backdrop-blur-xl supports-[backdrop-filter]:bg-[rgb(var(--bg))]/60">
      <div className="containerX flex h-16 items-center justify-between">
        <Link to="/" className="text-lg font-black tracking-tight">
          Venn Tech Co
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          <Link className="text-muted transition hover:text-[rgb(var(--fg))]" to="/">
            Home
          </Link>

          {authed && (
            <Link
              className="text-muted transition hover:text-[rgb(var(--fg))]"
              to="/dashboard"
            >
              Dashboard
            </Link>
          )}

          {authed && user?.role === "ADMIN" && (
            <Link
              className="text-muted transition hover:text-[rgb(var(--fg))]"
              to="/admin/users"
            >
              Approve Users
            </Link>
          )}

          {!authed ? (
            <>
              <Link
                className="text-muted transition hover:text-[rgb(var(--fg))]"
                to="/login"
              >
                Login
              </Link>

              <Link
                className="text-muted transition hover:text-[rgb(var(--fg))]"
                to="/register"
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={onLogout}
              className="rounded-xl border soft-border px-3 py-2 transition hover:bg-[rgb(var(--border))]/20"
            >
              Logout
            </button>
          )}

          <ThemeSwitcher />
        </nav>
      </div>
    </header>
  );
}