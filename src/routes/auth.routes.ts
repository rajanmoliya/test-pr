import { Router } from "express";
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

export const authRoutes = router;
