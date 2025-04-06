require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { errorHandler } = require("./middleware/errorHandler");
const { notFoundHandler } = require("./middleware/notFoundHandler");
const { setupRoutes } = require("./routes");
const { logger } = require("./utils/logger");

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use("/api", limiter);

// Routes Setup
setupRoutes(app);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

// stash 2
