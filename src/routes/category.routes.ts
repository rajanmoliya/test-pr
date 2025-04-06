import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { validateRequest } from "../middleware/validate-request";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validations/category.validation";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/authorize";

const router = Router();
const categoryController = new CategoryController();

// Public routes
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);

// Protected routes (admin only)
router.post(
  "/",
  authenticate,
  authorize(["admin"]),
  validateRequest(createCategorySchema),
  categoryController.createCategory
);

router.put(
  "/:id",
  authenticate,
  authorize(["admin"]),
  validateRequest(updateCategorySchema),
  categoryController.updateCategory
);

router.delete(
  "/:id",
  authenticate,
  authorize(["admin"]),
  categoryController.deleteCategory
);

export const categoryRoutes = router;
