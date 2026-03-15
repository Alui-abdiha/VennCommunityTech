import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ ok: false, message: "Missing token" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("-passwordHash");
    if (!user) return res.status(401).json({ ok: false, message: "User not found" });

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ ok: false, message: "Invalid token" });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ ok:false, message:"Unauthorized" });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ ok:false, message:"Forbidden" });
    }
    next();
  };
}