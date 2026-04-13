import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUser, logout, isAuthed } from "../services/auth";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Navbar() {
  const nav = useNavigate();
  const authed = isAuthed();
  const user = getUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function onLogout() {
    logout();
    nav("/");
    setMobileMenuOpen(false);
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b soft-border bg-[rgb(var(--bg))]/70 backdrop-blur-xl supports-[backdrop-filter]:bg-[rgb(var(--bg))]/60">
      <div className="containerX flex h-16 items-center justify-between px-4">
        {/* Left: Logo + Brand (prevents overflow on small screens) */}
        <div className="flex items-center gap-2 min-w-0">
          <img 
            src='/OfficialLogo.jpeg' 
            alt="logo" 
            className="w-10 h-10 rounded-full object-cover flex-shrink-0" 
          />
          <Link 
            to="/" 
            className="text-lg font-black tracking-tight truncate"
          >
            Venn Tech Community
          </Link>
        </div>

        {/* Desktop Navigation (hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-3 text-sm">
          <Link className="text-muted transition hover:text-[rgb(var(--fg))]" to="/">Home</Link>
          {authed && (
            <Link className="text-muted transition hover:text-[rgb(var(--fg))]" to="/dashboard">Dashboard</Link>
          )}
          {authed && user?.role === "ADMIN" && (
            <Link className="text-muted transition hover:text-[rgb(var(--fg))]" to="/admin/users">Approve Users</Link>
          )}
          {!authed ? (
            <>
              <Link className="text-muted transition hover:text-[rgb(var(--fg))]" to="/login">Login</Link>
              <Link className="text-muted transition hover:text-[rgb(var(--fg))]" to="/register">Register</Link>
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

        {/* Mobile Menu Toggle Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-[rgb(var(--border))]/20 transition"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
            />
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t soft-border bg-[rgb(var(--bg))]/95 backdrop-blur-xl">
          <nav className="flex flex-col p-4 gap-2 text-sm">
            <Link className="text-muted transition hover:text-[rgb(var(--fg))] py-2 px-3 rounded-lg hover:bg-[rgb(var(--border))]/10" to="/" onClick={closeMobileMenu}>Home</Link>
            {authed && (
              <Link className="text-muted transition hover:text-[rgb(var(--fg))] py-2 px-3 rounded-lg hover:bg-[rgb(var(--border))]/10" to="/dashboard" onClick={closeMobileMenu}>Dashboard</Link>
            )}
            {authed && user?.role === "ADMIN" && (
              <Link className="text-muted transition hover:text-[rgb(var(--fg))] py-2 px-3 rounded-lg hover:bg-[rgb(var(--border))]/10" to="/admin/users" onClick={closeMobileMenu}>Approve Users</Link>
            )}
            {!authed ? (
              <>
                <Link className="text-muted transition hover:text-[rgb(var(--fg))] py-2 px-3 rounded-lg hover:bg-[rgb(var(--border))]/10" to="/login" onClick={closeMobileMenu}>Login</Link>
                <Link className="text-muted transition hover:text-[rgb(var(--fg))] py-2 px-3 rounded-lg hover:bg-[rgb(var(--border))]/10" to="/register" onClick={closeMobileMenu}>Register</Link>
              </>
            ) : (
              <button
                onClick={onLogout}
                className="text-left rounded-xl border soft-border px-3 py-2 transition hover:bg-[rgb(var(--border))]/20"
              >
                Logout
              </button>
            )}
            <div className="mt-2 pt-3 border-t soft-border px-3">
              <ThemeSwitcher />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}