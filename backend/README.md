# Vasantha Home Made Pickles — Production Backend

A **Node.js + Express + MongoDB** REST API for the Vasantha Pickles e-commerce platform.

## 🚀 Quick Start

### 1. Setup environment variables
```bash
cp .env.example .env
# Fill in your MongoDB URI, JWT secret, and Razorpay keys
```

### 2. Install dependencies
```bash
npm install
```

### 3. Seed the database with products
```bash
node src/scripts/seedProducts.js
```

### 4. Start the development server
```bash
npm run dev
```

Server runs on: `http://localhost:5000`

---

## 📡 API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login user |
| GET | `/api/auth/me` | Private | Get current user |
| GET | `/api/products` | Public | Get all products |
| GET | `/api/products/:id` | Public | Get product by ID |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |
| POST | `/api/orders` | Private | Place an order |
| GET | `/api/orders/my` | Private | Get my orders |
| GET | `/api/orders` | Admin | Get all orders |
| PUT | `/api/orders/:id/status` | Admin | Update order status |
| GET | `/api/addresses` | Private | Get saved addresses |
| POST | `/api/addresses` | Private | Add new address |
| DELETE | `/api/addresses/:id` | Private | Delete address |
| POST | `/api/payments/create-order` | Private | Create Razorpay order |
| POST | `/api/payments/verify` | Private | Verify payment |

---

## 🛠 Tech Stack
- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Auth**: JWT + bcryptjs
- **Payments**: Razorpay

## 🐳 Docker
```bash
docker build -t pickles-backend .
docker run -p 5000:5000 --env-file .env pickles-backend
```
