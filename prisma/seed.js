const { PrismaClient, OrderStatus, PaymentStatus } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password: hashedPassword,
      firstName: "Admin",
      lastName: "User",
      role: "ADMIN",
      isVerified: true,
      phone: "+1234567890",
      addresses: {
        create: {
          street: "123 Admin Street",
          city: "Admin City",
          state: "Admin State",
          country: "Admin Country",
          postalCode: "12345",
          isDefault: true,
        },
      },
    },
    include: {
      addresses: true,
    },
  });

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: "Electronics" },
      update: {},
      create: {
        name: "Electronics",
        description: "Electronic devices and accessories",
      },
    }),
    prisma.category.upsert({
      where: { name: "Clothing" },
      update: {},
      create: {
        name: "Clothing",
        description: "Fashion and apparel",
      },
    }),
    prisma.category.upsert({
      where: { name: "Books" },
      update: {},
      create: {
        name: "Books",
        description: "Books and literature",
      },
    }),
  ]);

  // First, check if products already exist
  const existingProducts = await prisma.product.findMany({
    where: {
      OR: [{ name: "Smartphone X" }, { name: "Designer T-Shirt" }],
    },
  });

  // Create or update products
  const products = await Promise.all([
    existingProducts.find((p) => p.name === "Smartphone X")
      ? prisma.product.update({
          where: {
            id: existingProducts.find((p) => p.name === "Smartphone X").id,
          },
          data: {
            description: "Latest smartphone with amazing features",
            price: 999.99,
            stock: 100,
            categoryId: categories[0].id,
            images: [
              "https://example.com/smartphone1.jpg",
              "https://example.com/smartphone2.jpg",
            ],
            specifications: {
              deleteMany: {},
              create: [
                { key: "Screen Size", value: "6.5 inches" },
                { key: "RAM", value: "8GB" },
                { key: "Storage", value: "128GB" },
              ],
            },
          },
        })
      : prisma.product.create({
          data: {
            name: "Smartphone X",
            description: "Latest smartphone with amazing features",
            price: 999.99,
            stock: 100,
            categoryId: categories[0].id,
            images: [
              "https://example.com/smartphone1.jpg",
              "https://example.com/smartphone2.jpg",
            ],
            specifications: {
              create: [
                { key: "Screen Size", value: "6.5 inches" },
                { key: "RAM", value: "8GB" },
                { key: "Storage", value: "128GB" },
              ],
            },
          },
        }),
    existingProducts.find((p) => p.name === "Designer T-Shirt")
      ? prisma.product.update({
          where: {
            id: existingProducts.find((p) => p.name === "Designer T-Shirt").id,
          },
          data: {
            description: "Premium quality cotton t-shirt",
            price: 49.99,
            stock: 200,
            categoryId: categories[1].id,
            images: [
              "https://example.com/tshirt1.jpg",
              "https://example.com/tshirt2.jpg",
            ],
            specifications: {
              deleteMany: {},
              create: [
                { key: "Material", value: "100% Cotton" },
                { key: "Size", value: "M" },
                { key: "Color", value: "Black" },
              ],
            },
          },
        })
      : prisma.product.create({
          data: {
            name: "Designer T-Shirt",
            description: "Premium quality cotton t-shirt",
            price: 49.99,
            stock: 200,
            categoryId: categories[1].id,
            images: [
              "https://example.com/tshirt1.jpg",
              "https://example.com/tshirt2.jpg",
            ],
            specifications: {
              create: [
                { key: "Material", value: "100% Cotton" },
                { key: "Size", value: "M" },
                { key: "Color", value: "Black" },
              ],
            },
          },
        }),
  ]);

  // Create a sample order with payment
  const payment = await prisma.payment.create({
    data: {
      amount: 1049.98,
      currency: "USD",
      status: PaymentStatus.COMPLETED,
      provider: "Stripe",
      paymentMethod: "Credit Card",
    },
  });

  const order = await prisma.order.create({
    data: {
      userId: admin.id,
      status: OrderStatus.COMPLETED,
      total: 1049.98,
      addressId: admin.addresses[0].id,
      paymentId: payment.id,
      orderItems: {
        create: [
          {
            productId: products[0].id,
            quantity: 1,
            price: products[0].price,
          },
          {
            productId: products[1].id,
            quantity: 1,
            price: products[1].price,
          },
        ],
      },
    },
  });

  // Create a sample review
  await prisma.review.create({
    data: {
      userId: admin.id,
      productId: products[0].id,
      rating: 5,
      comment: "Amazing product! Highly recommended.",
    },
  });

  // Create a sample wishlist item
  await prisma.wishlistItem.create({
    data: {
      userId: admin.id,
      productId: products[1].id,
    },
  });

  console.log("Database has been seeded. 🌱");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
