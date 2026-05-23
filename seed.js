// seed.js
const  dns = require ('node:dns')
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const DB_NAME = require("./constants");

// ─── Import your actual models ────────────────────────────────────────────────
const User    = require("./model/user");
const Product = require("./model/product");
const Order   = require("./model/order");

// ─── Connect (same way your connectDB does it) ────────────────────────────────
const MONGO_URI = `${process.env.MONGO_URI}/${DB_NAME}`;

// ─── Users ────────────────────────────────────────────────────────────────────
const rawUsers = [
  { name: "Admin User",  email: "admin@shoppy.com",  password: "Admin@123", role: "admin", isVerified: true  },
  { name: "Riya Sharma", email: "riya@example.com",  password: "User@1234", role: "user",  isVerified: true  },
  { name: "Arjun Mehta", email: "arjun@example.com", password: "User@1234", role: "user",  isVerified: true  },
  { name: "Priya Singh", email: "priya@example.com", password: "User@1234", role: "user",  isVerified: false },
  { name: "Rahul Verma", email: "rahul@example.com", password: "User@1234", role: "user",  isVerified: true  },
];

// ─── Products ─────────────────────────────────────────────────────────────────
const productsData = [
  {
    name:        "Wireless Bluetooth Earbuds",
    description: "True wireless earbuds with active noise cancellation, 30hr battery life, and premium sound quality.",
    price:       1999,
    category:    "Electronics",
    stock:       80,
    imageurl:    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400",
    rating:      4.5,
    numReviews:  120,
  },
  {
    name:        "Men's Running Shoes",
    description: "Lightweight breathable mesh running shoes with cushioned sole, ideal for daily jogging.",
    price:       1499,
    category:    "Footwear",
    stock:       150,
    imageurl:    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    rating:      4.2,
    numReviews:  85,
  },
  {
    name:        "Stainless Steel Water Bottle",
    description: "1 litre double-walled insulated bottle. Keeps cold 24hrs, hot 12hrs.",
    price:       499,
    category:    "Kitchen",
    stock:       200,
    imageurl:    "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
    rating:      4.7,
    numReviews:  240,
  },
  {
    name:        "Mechanical Gaming Keyboard",
    description: "TKL layout with blue switches, full RGB backlight, and anti-ghosting technology.",
    price:       3499,
    category:    "Electronics",
    stock:       40,
    imageurl:    "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400",
    rating:      4.6,
    numReviews:  65,
  },
  {
    name:        "Yoga Mat 6mm",
    description: "Non-slip eco-friendly TPE yoga mat with carry strap, perfect for yoga and pilates.",
    price:       699,
    category:    "Fitness",
    stock:       110,
    imageurl:    "https://images.unsplash.com/photo-1601925228008-c4b0e5b8a8c8?w=400",
    rating:      4.3,
    numReviews:  98,
  },
  {
    name:        "30L Hiking Backpack",
    description: "Water-resistant polyester backpack with padded laptop compartment and multiple organizer pockets.",
    price:       999,
    category:    "Bags",
    stock:       70,
    imageurl:    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
    rating:      4.4,
    numReviews:  53,
  },
];

// ─── Seed ─────────────────────────────────────────────────────────────────────
async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅  Connected to MongoDB:");

    // ── Clear collections ───────────────────────────────────────────────────
    await Order.deleteMany({});
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log("🗑️   Cleared Orders, Users, Products");

    // ── Hash passwords & insert users ───────────────────────────────────────
    const hashedUsers = await Promise.all(
      rawUsers.map(async (u) => {
        const salt           = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(u.password, salt);
        return { ...u, password: hashedPassword, verified: u.isVerified };
      })
    );
    const users = await User.insertMany(hashedUsers);
    console.log(`👤  Seeded ${users.length} users`);
    users.forEach((u) => console.log(`    • ${u.name} (${u.role}) — ${u.email}`));

    // ── Insert products ─────────────────────────────────────────────────────
    const products = await Product.insertMany(productsData);
    console.log(`📦  Seeded ${products.length} products`);

    // ── Build orders ────────────────────────────────────────────────────────
    const regularUsers = users.filter((u) => u.role === "user");

    const addresses = [
      { fullname: "Riya Sharma", street: "12 MG Road",     city: "Mumbai"  },
      { fullname: "Arjun Mehta", street: "45 Park Street", city: "Kolkata" },
      { fullname: "Priya Singh", street: "7 Civil Lines",  city: "Delhi"   },
      { fullname: "Rahul Verma", street: "88 Anna Salai",  city: "Chennai" },
    ];

    const statuses = ["pending", "shipped", "delivered"];

    const ordersData = regularUsers.map((user, i) => {
      const p1          = products[i % products.length];
      const p2          = products[(i + 2) % products.length];
      const items       = [
        { product: p1._id, quantity: 1 },
        { product: p2._id, quantity: 2 },
      ];
      const totalAmount = p1.price * 1 + p2.price * 2;
      return {
        user:      user._id,
        products:  items,
        totalAmount,
        address:   addresses[i] || addresses[0],
        paymentId: `pay_SEED${Date.now()}${i}`,
        status:    statuses[i % statuses.length],
      };
    });

    const orders = await Order.insertMany(ordersData);
    console.log(`🛒  Seeded ${orders.length} orders`);

    console.log("\n🎉  Database seeded successfully!\n");
    console.log("─────────────────────────────────────────────────");
    console.log("  Admin → admin@shoppy.com   pw: Admin@123");
    console.log("  User  → riya@example.com   pw: User@1234");
    console.log("─────────────────────────────────────────────────\n");

  } catch (err) {
    console.error("❌  Seeding failed:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌  Disconnected from MongoDB");
  }
}

seed();