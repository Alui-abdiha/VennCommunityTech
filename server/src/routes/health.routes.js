import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  res.json({ ok: true, app: "Venn Tech Co API", time: new Date().toISOString() });
});

export default router;