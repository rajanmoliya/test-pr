import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { validateRequest } from "../middleware/validate-request";
import { updateUserSchema } from "../validations/user.validation";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/authorize";

const router = Router();
const userController = new UserController();

// Protected routes (authenticated users)
router.get("/profile", authenticate, userController.getProfile);
router.put(
  "/profile",
  authenticate,
  validateRequest(updateUserSchema),
  userController.updateProfile
);

// Protected routes (admin only)
router.get("/", authenticate, authorize(["admin"]), userController.getAllUsers);

router.get(
  "/:id",
  authenticate,
  authorize(["admin"]),
  userController.getUserById
);

router.put(
  "/:id",
  authenticate,
  authorize(["admin"]),
  validateRequest(updateUserSchema),
  userController.updateUser
);

router.delete(
  "/:id",
  authenticate,
  authorize(["admin"]),
  userController.deleteUser
);

export const userRoutes = router;
