import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ ok: false, message: "No token" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("_id fullName email role status teamId points");

    if (!user) {
      return res.status(401).json({ ok: false, message: "User not found" });
    }

    if (user.status !== "APPROVED") {
      return res.status(403).json({ ok: false, message: "Account not approved yet" });
    }

    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ ok: false, message: "Invalid token" });
  }
}