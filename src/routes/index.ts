<<<<<<< HEAD
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
=======
import { Router, Request, Response } from "express";
import { authRoutes } from "./auth.routes";
const router = Router();

router.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

router.use("/auth", authRoutes);
>>>>>>> fa348557fcf99f2ce03f13fa6388d3979e6e1240

export const routes = router;
