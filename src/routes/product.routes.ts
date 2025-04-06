import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { validateRequest } from "../middleware/validate-request";
import {
  createProductSchema,
  updateProductSchema,
} from "../validations/product.validation";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/authorize";

const router = Router();
const productController = new ProductController();

// Public routes
router.get("/", productController.getAllProducts);
router.get("/search", productController.searchProducts);
router.get("/:id", productController.getProductById);
router.get("/category/:categoryId", productController.getProductsByCategory);

// Protected routes (admin only)
router.post(
  "/",
  authenticate,
  authorize(["admin"]),
  validateRequest(createProductSchema),
  productController.createProduct
);

router.put(
  "/:id",
  authenticate,
  authorize(["admin"]),
  validateRequest(updateProductSchema),
  productController.updateProduct
);

router.delete(
  "/:id",
  authenticate,
  authorize(["admin"]),
  productController.deleteProduct
);

export const productRoutes = router;
