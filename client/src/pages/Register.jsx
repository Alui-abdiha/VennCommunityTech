import { useState } from "react";
import { Link } from "react-router-dom";
import { register } from "../services/authService";
import Navbar from "../components/Navbar.jsx";

export default function Register() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [msg, setMsg] = useState("");

  async function onSubmit(e) {
    e.preventDefault(); 
    setMsg("");
    try {
      const res = await register(form);
      setMsg(res.message || "Registered. Waiting for approval.");
    } catch (err) {
      setMsg(err?.response?.data?.message || "Register failed");
    }
  }

  return (
    <div>
      <Navbar />
      <div className="containerX py-14 max-w-md">
        <div className="card-bg soft-border rounded-2xl border p-6">
          <h2 className="text-2xl font-black">Register</h2>
          <p className="text-muted mt-1">Admin must approve your account.</p>

          {msg && <div className="mt-4 soft-border border rounded-xl p-3 text-sm">{msg}</div>}

          <form className="mt-4 grid gap-3" onSubmit={onSubmit}>
            <input
              className="soft-border border rounded-xl px-3 py-2 bg-transparent"
              placeholder="Full Name"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
            <input
              className="soft-border border rounded-xl px-3 py-2 bg-transparent"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              className="soft-border border rounded-xl px-3 py-2 bg-transparent"
              placeholder="Password (min 6)"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button className="brand-gradient rounded-xl px-4 py-2 font-semibold text-white">
              Register
            </button>
          </form>

          <p className="text-sm text-muted mt-4">
            Already have account? <Link className="underline" to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}