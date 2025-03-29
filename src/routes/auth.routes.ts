import { Router } from "express";
import { AuthService } from "../services/auth.service";

const router = Router();

router.post("/register", async (req, res) => {
  const result = await AuthService.register(req.body);
  res.status(201).json(result);
});

router.post("/login", async (req, res) => {
  const result = await AuthService.login(req.body);
  res.json(result);
});

export const authRoutes = router;
