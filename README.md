# 🛍️ Shoppy — E-Commerce Backend API

Shoppy is a Node.js/Express REST API powering an e-commerce platform. It handles user authentication with email OTP verification, product catalog management, order processing, Razorpay payments, S3-backed image uploads, and admin analytics.

**Live client:** [live-shoppy.netlify.app](https://live-shoppy.netlify.app)

---

## ✨ Features

- 🔐 **Authentication** — JWT-based auth with bcrypt password hashing and email OTP verification (via Resend)
- 👤 **Role-based access control** — `user` and `admin` roles with protected/admin-only routes
- 🛒 **Product catalog** — Full CRUD for products, with image upload to AWS S3
- 📦 **Order management** — Place orders, view order history, admin order tracking & status updates
- 💳 **Payments** — Razorpay order creation and payment signature verification
- 📊 **Admin analytics** — Live dashboard stats: total users, orders, products, and revenue
- 📧 **Transactional email** — Welcome/OTP and order confirmation emails

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express 5 |
| Database | MongoDB + Mongoose |
| Auth | JWT, bcryptjs |
| Payments | Razorpay |
| Email | Resend |
| File Storage | AWS S3 (`@aws-sdk/client-s3`) |
| Uploads | Multer |
| Dev Tools | Nodemon |

---

## 📁 Project Structure

```
shoppy/
├── config/
│   ├── db.js                   # MongoDB connection
│   ├── s3.js                   # AWS S3 client setup
│   └── cloudinary.js           # (unused – legacy config)
├── controllers/
│   ├── authController.js       # Register, login, OTP verification
│   ├── productcontroller.js    # Product CRUD
│   ├── orderController.js      # Order creation & tracking
│   ├── paymentcontroller.js    # Razorpay order & verification
│   └── analyticscontroller.js  # Admin dashboard stats
├── middleware/
│   ├── authmiddleware.js       # JWT verification
│   ├── admin.middleware.js     # Admin-only guard
│   └── multer.middleware.js    # Multipart upload handling
├── model/
│   ├── user.js
│   ├── product.js
│   └── order.js
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   ├── paymentRoutes.js
│   └── analyticsRoutes.js
├── utils/
│   ├── sendEmail.js            # Resend email wrapper
│   └── s3utils.js              # S3 upload helper
├── constants.js                # DB name constant
├── seed.js                     # DB seeding script
├── index.js                    # App entry point
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB database (local or Atlas)
- API keys for: **Razorpay**, **Resend**, **AWS S3**

### 1. Clone & install

```bash
git clone https://github.com/krishnasharma0101k/shoppy.git
cd shoppy
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
# Server
PORT=4000

# Database
MONGO_URI=your_mongodb_connection_string

# Auth
JWT_SECRET=your_jwt_secret

# Email (Resend)
RESEND_API_KEY=your_resend_api_key

# Payments (Razorpay)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# File storage (AWS S3)
AWS_REGION=your_aws_region
AWS_ENDPOINT=your_aws_endpoint
AWS_ASSESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
```

> `MONGO_URI` should be your base connection string **without** a trailing database name — the app appends the database name (`shoppy`) automatically from `constants.js`.

### 3. Run it

```bash
npm run dev     # development, with hot reload
npm start       # production
npm run seed    # seed the database with sample data
```

The API will be live at `http://localhost:4000`.

---

## 📚 API Reference

### Auth — `/api/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/register` | Public | Register a new user; sends OTP via email |
| `POST` | `/login` | Public | Log in and receive a JWT |
| `POST` | `/verify-otp` | Public | Verify a registered user's email OTP |
| `GET` | `/user` | Admin | List all users |

### Products — `/api/products`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Public | List all products |
| `GET` | `/:id` | Public | Get a single product |
| `POST` | `/` | Admin | Create a product (multipart, field: `image`) |
| `PUT` | `/:id` | Admin | Update a product (multipart, field: `image`) |
| `DELETE` | `/:id` | Admin | Delete a product |

### Orders — `/api/orders`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/` | User | Create an order — body: `{ items, totalAmount, address, paymentId }` |
| `GET` | `/myorders` | User | Get the current user's order history |
| `GET` | `/` | Admin | List all orders |
| `PUT` | `/:id/status` | Admin | Update an order's status (`pending`, `shipped`, `delivered`) |

### Payments — `/api/payment`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/order` | Public | Create a Razorpay order |
| `POST` | `/verify` | Public | Verify Razorpay payment signature |

### Analytics — `/api/analytics`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Admin | Dashboard stats: total users, orders, products, revenue |

**Auth header for protected routes:**
```
Authorization: Bearer <token>
```

---

## 🔒 Access Control Summary

- **Public** — browsing products, registering/logging in, initiating payments
- **User** (authenticated) — placing orders, viewing own order history
- **Admin** — managing products, viewing all orders/users, updating order status, viewing analytics

---

## 📄 License

ISC — © Krishna Sharma
