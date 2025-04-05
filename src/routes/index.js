const authRoutes = require('./auth.routes');
const { verifyToken } = require('../middleware/auth');

const setupRoutes = (app) => {
  // Public routes
  app.use('/api/auth', authRoutes);

  // Protected routes (will be added later)
  // app.use('/api/users', verifyToken, userRoutes);
  // app.use('/api/products', verifyToken, productRoutes);
  // app.use('/api/orders', verifyToken, orderRoutes);
};

module.exports = { setupRoutes }; 