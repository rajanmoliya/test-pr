import "express-async-errors";
import express from "express";
import { PrismaClient } from "@prisma/client";
import { errorHandler } from "./middleware/errorHandler";
import { notFoundHandler } from "./middleware/notFoundHandler";
import { routes } from "./routes";

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use("/api", routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Handle graceful shutdown OOPS I ADDED THIS LINE
process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// THIS IS THE FIX for testing the PR...
