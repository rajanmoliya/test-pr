import { Router } from "express";
<<<<<<< HEAD
import { AuthController } from "../controllers/auth.controller";
import { validateRequest } from "../middleware/validate-request";
import { loginSchema, registerSchema } from "../validations/auth.validation";
import { authenticate } from "../middleware/auth";

const router = Router();
const authController = new AuthController();

// Public routes
router.post(
  "/register",
  validateRequest(registerSchema),
  authController.register
);
router.post("/login", validateRequest(loginSchema), authController.login);
router.post("/verify-email", authController.verifyEmail);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

// Protected routes
router.get("/me", authenticate, authController.getCurrentUser);
router.put("/me", authenticate, authController.updateProfile);
router.put("/change-password", authenticate, authController.changePassword);
=======
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
>>>>>>> fa348557fcf99f2ce03f13fa6388d3979e6e1240

export const authRoutes = router;
