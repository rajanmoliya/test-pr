import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { validateRequest } from "../middleware/validate-request";
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from "../validations/order.validation";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/authorize";

const router = Router();
const orderController = new OrderController();

// Protected routes (authenticated users)
router.get("/", authenticate, orderController.getUserOrders);
router.get("/:id", authenticate, orderController.getOrderById);
router.post(
  "/",
  authenticate,
  validateRequest(createOrderSchema),
  orderController.createOrder
);

// Protected routes (admin only)
router.get(
  "/admin/all",
  authenticate,
  authorize(["admin"]),
  orderController.getAllOrders
);

router.put(
  "/:id/status",
  authenticate,
  authorize(["admin"]),
  validateRequest(updateOrderStatusSchema),
  orderController.updateOrderStatus
);

export const orderRoutes = router;
