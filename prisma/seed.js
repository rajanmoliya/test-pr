const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isVerified: true
    }
  });

  // Create test categories
  const electronics = await prisma.category.create({
    data: {
      name: 'Electronics',
      description: 'Electronic devices and accessories'
    }
  });

  const clothing = await prisma.category.create({
    data: {
      name: 'Clothing',
      description: 'Fashion and apparel'
    }
  });

  // Create test products
  await prisma.product.createMany({
    data: [
      {
        name: 'Smartphone',
        description: 'Latest smartphone with advanced features',
        price: 699.99,
        stock: 50,
        categoryId: electronics.id,
        images: ['smartphone1.jpg', 'smartphone2.jpg']
      },
      {
        name: 'Laptop',
        description: 'High-performance laptop for professionals',
        price: 1299.99,
        stock: 30,
        categoryId: electronics.id,
        images: ['laptop1.jpg', 'laptop2.jpg']
      },
      {
        name: 'T-Shirt',
        description: 'Comfortable cotton t-shirt',
        price: 19.99,
        stock: 100,
        categoryId: clothing.id,
        images: ['tshirt1.jpg', 'tshirt2.jpg']
      }
    ]
  });

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 