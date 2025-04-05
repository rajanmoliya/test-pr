# Modern E-commerce API

A comprehensive e-commerce backend API built with Node.js, Express, and PostgreSQL (Prisma) that demonstrates real-world practices and concepts.

## Features

- 🔐 Advanced Authentication (JWT with Access/Refresh Tokens)
- 👤 User Management
- 📦 Product Management
- 🛒 Shopping Cart
- 💖 Wishlist
- 📝 Order Processing
- 💳 Payment Integration (Stripe)
- 📧 Email Notifications
- 🔔 Real-time Updates
- 🎯 Webhook Management
- 📊 Complex Database Relations

## Tech Stack

- Node.js & Express
- PostgreSQL with Prisma ORM
- JWT Authentication
- Winston Logger
- Zod Validation
- Jest Testing
- ESLint & Prettier
- Git Workflow

## Project Structure

```
src/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── middleware/       # Custom middleware
├── models/          # Database models and schemas
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Utility functions
└── validators/      # Request validation schemas

prisma/
├── migrations/      # Database migrations
└── schema.prisma    # Prisma schema

tests/
├── integration/     # Integration tests
└── unit/           # Unit tests
```

## Git Branches

- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: New features
- `bugfix/*`: Bug fixes
- `release/*`: Release preparation
- `hotfix/*`: Production hotfixes

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd modern-ecommerce-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configurations
   ```

4. Set up the database:
   ```bash
   npm run migrate
   npm run seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh-token
- POST /api/auth/logout

### Users
- GET /api/users/profile
- PUT /api/users/profile
- GET /api/users/addresses
- POST /api/users/addresses

### Products
- GET /api/products
- GET /api/products/:id
- POST /api/products (Admin)
- PUT /api/products/:id (Admin)
- DELETE /api/products/:id (Admin)

### Orders
- GET /api/orders
- POST /api/orders
- GET /api/orders/:id
- PUT /api/orders/:id/status (Admin)

### Cart
- GET /api/cart
- POST /api/cart/items
- PUT /api/cart/items/:id
- DELETE /api/cart/items/:id

### Webhooks
- POST /api/webhooks/stripe
- POST /api/webhooks/email

## Testing

```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration
```

## Contributing

1. Create a new feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

3. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a Pull Request

## License

MIT 