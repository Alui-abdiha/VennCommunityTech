import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault(); 

    if (!form.email || !form.password) {
      setError("email, password required");
      return;
    }

    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="containerX py-16">
      <div className="max-w-md mx-auto card-bg p-8 rounded-2xl shadow-xl soft-border border">
        <h1 className="text-3xl font-black mb-2">Login</h1>
        <p className="text-muted mb-6">Login to Venn Tech Co.</p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-100 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 px-4 py-3 rounded-xl border"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full mb-6 px-4 py-3 rounded-xl border"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button
            type="submit"
            className="w-full py-3 rounded-xl brand-gradient text-white font-bold"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}