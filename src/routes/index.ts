import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { productRoutes } from "./product.routes";
import { orderRoutes } from "./order.routes";
import { userRoutes } from "./user.routes";
import { categoryRoutes } from "./category.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);

export const routes = router;
