import { api } from "./api";
import { setAuth } from "./auth";

export async function login(email, password) {
  const res = await api.post("/auth/login", { email, password });

  // expects backend returns: { ok:true, token, user }
  setAuth(res.data.token, res.data.user);

  return res.data;
}
export async function register(form) {
  const { fullName, email, password } = form;
  const res = await api.post("/auth/register", { fullName, email, password });
  return res.data;
}