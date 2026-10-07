# ROYAL BLIZ

> **SHOP • SELL • GROW**

A full-stack **MERN** e-commerce marketplace with three roles — **Buyer**, **Vendor**, and a single **hidden Admin** — plus Paystack test payments, Cloudinary image hosting, automatic PDF receipts, and email notifications.

Built with **JavaScript only** (no TypeScript), using simple, beginner-friendly code.

---

## ✨ Features

- **Buyer**: browse/search/filter products, cart (localStorage), checkout, Paystack payment, orders, wishlist, profile, PDF receipt download.
- **Vendor**: product CRUD with Cloudinary image uploads, sales chart, recent orders, top products, order status updates, store profile.
- **Admin** (hidden, single account): platform statistics, manage users, deactivate vendors, remove products, manage orders.
- **Auth**: JWT + bcrypt, register (Buyer/Vendor only), login (auto role detection), logout, forgot/reset password, profile & picture editing.
- **Payments**: Paystack **test mode** with server-side verification + webhook (HMAC signature).
- **Receipts**: automatic professional PDF receipts (PDFKit) uploaded to Cloudinary as `raw`.
- **Emails**: welcome, password reset, order confirmation, and payment receipt (Nodemailer).

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite, React Router, Axios |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Auth | JWT, bcryptjs |
| Images | Cloudinary + Multer (memory storage) |
| Payments | Paystack (test mode) |
| Receipts | PDFKit |
| Email | Nodemailer |

---

## 📁 Project Structure

```
royal-bliz/
├── frontend/                 # React + Vite app
│   └── src/
│       ├── api/              # Axios instance
│       ├── components/       # Navbar, Footer, cards, guards, layouts
│       ├── context/          # AuthContext, CartContext
│       ├── pages/            # Home, Shop, buyer/, vendor/, admin/, etc.
│       └── utils/            # formatting helpers
├── backend/                  # Express API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── config/
│   ├── seeds/
│   ├── server.js
│   └── .env.example
└── README.md
```

---

## ✅ Prerequisites

- **Node.js** 18+ (tested on Node 26)
- **npm**
- A **MongoDB** database (local MongoDB or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)
- A free **[Cloudinary](https://cloudinary.com)** account
- A free **[Paystack](https://paystack.com)** account (use **test keys**)
- An **SMTP** provider for email (Gmail app password, Mailtrap, SendGrid, etc.)

---

## 🚀 Installation

### 1. Backend

```bash
cd backend
npm install
```

Copy the example env file and fill in your values:

```bash
cp .env.example .env      # Windows: copy .env.example .env
```

### 2. Frontend

```bash
cd ../frontend
npm install
```

Copy the example env file:

```bash
cp .env.example .env      # Windows: copy .env.example .env
```

> The frontend only needs `VITE_API_URL` (defaults to `http://localhost:5000`).

---

## 🔧 Environment Variables (backend `.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Backend port (default `5000`) |
| `MONGO_URI` | Your MongoDB connection string |
| `JWT_SECRET` | A long random secret for signing tokens |
| `PAYSTACK_SECRET_KEY` | Paystack **test** secret key (`sk_test_...`) |
| `PAYSTACK_PUBLIC_KEY` | Paystack **test** public key (`pk_test_...`) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `SMTP_HOST` | SMTP host (e.g. `smtp.gmail.com`) |
| `SMTP_PORT` | `587` (or `465` for SSL) |
| `SMTP_USER` | SMTP username/email |
| `SMTP_PASS` | SMTP password / app password |
| `SMTP_FROM` | Sender address, e.g. `"ROYAL BLIZ <no-reply@you.com>"` |
| `CLIENT_URL` | Frontend URL (`http://localhost:5173`) |
| `ADMIN_NAME` | Admin display name |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin password |

> **Security:** keep `.env` out of version control (it is already in `.gitignore`). Secrets stay on the backend only — they are never sent to the frontend.

---

## 🗄️ MongoDB Setup

**Option A — Local MongoDB**

1. Install MongoDB Community Server and start the service.
2. Set `MONGO_URI=mongodb://127.0.0.1:27017/royal-bliz`.

**Option B — MongoDB Atlas (free)**

1. Create a free cluster.
2. Create a database user and allow your IP (or `0.0.0.0/0` for testing).
3. Copy the connection string and replace `<password>` with your user's password:
   `MONGO_URI=mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/royal-bliz`

---

## ☁️ Cloudinary Setup

1. Create a free Cloudinary account.
2. Open the **Dashboard** and copy your **Cloud name**, **API Key**, and **API Secret** into `.env`.

Product images are uploaded to the `royal-bliz/products` folder and profile pictures to `royal-bliz/profiles`. Replacing or deleting an image also removes the old Cloudinary asset.

> **No images are stored locally or in MongoDB** — only Cloudinary URLs + public IDs are saved.

---

## 💳 Paystack Test Setup

1. Create a Paystack account and go to **Settings → API Keys**.
2. Copy the **test** secret key (`sk_test_...`) and **test** public key (`pk_test_...`) into `.env`.
3. Use these test cards at checkout:
   - `4084 0840 8408 4081` (any future expiry, CVV `408`, PIN `0000`, OTP `123456`) — or use the "Success" option in the Paystack test popup.

**Payment flow (all verified server-side):**

1. Frontend creates a **pending** order (`POST /api/orders`).
2. Backend initializes Paystack (`POST /api/payments/initialize`) and returns an `authorization_url`.
3. The user is redirected to Paystack.
4. Paystack redirects back to `/payment/verify?reference=...`.
5. Backend calls Paystack verify, checks `reference`, `amount`, and `currency` (NGN).
6. Only after successful verification is the order marked **PAID**, a PDF receipt generated, and a receipt email sent.
7. A `POST /api/payments/webhook` endpoint (HMAC-signed) handles `charge.success` events as a backup.

> The frontend is never trusted for payment success.

---

## 📧 Nodemailer Setup

Set `SMTP_*` in `.env`. Examples:

**Gmail (app password):**

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@gmail.com
SMTP_PASS=your_16_char_app_password
```

> For Gmail, enable 2-Step Verification and create an **App Password**.

**Mailtrap (for testing):**

```env
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=your_mailtrap_user
SMTP_PASS=your_mailtrap_pass
```

---

## 🌱 Seeding

### Demo products

```bash
cd backend
npm run seed
```

This creates a demo vendor (`demo.vendor@royalbliz.com` / `password123`) and uploads demo product images to Cloudinary under `royal-bliz/products`.

### The single hidden admin

```bash
cd backend
npm run seed:admin
```

This creates (or resets) the **one** admin using `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env`.

> There is **no** admin signup button or admin role option anywhere in the UI. The only way to create the admin is `npm run seed:admin`.

---

## ▶️ Running the App

Run both servers in separate terminals:

```bash
# Terminal 1 — backend
cd backend
npm run dev          # or: npm start

# Terminal 2 — frontend
cd frontend
npm run dev
```

Open **http://localhost:5173**.

**Seeding order that works best:**

```bash
cd backend
npm run seed:admin   # create the admin
npm run seed         # create demo products + vendor
npm run dev          # start the API
```

---

## 👥 Roles

| Role | Where it signs up | Access |
|------|-------------------|--------|
| **Buyer** | Register page (choose Buyer) | `/buyer` dashboard, shop, cart, checkout, orders, wishlist |
| **Vendor** | Register page (choose Vendor) | `/vendor` dashboard, product CRUD, orders, store profile |
| **Admin** | `npm run seed:admin` only | `/admin` dashboard, users, vendors, products, orders |

Login detects the role **from the database** and redirects automatically. The role is **never** trusted from the frontend.

---

## 🔌 API Routes

### Auth
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/forgot-password
POST /api/auth/reset-password/:token
GET  /api/auth/me
PUT  /api/auth/profile
PUT  /api/auth/profile-picture
```

### Products
```
GET    /api/products
GET    /api/products/:id
POST   /api/products            (vendor)
PUT    /api/products/:id        (vendor, own only)
DELETE /api/products/:id        (vendor own / admin)
```

### Orders
```
POST /api/orders                (buyer)
GET  /api/orders                (buyer/vendor/admin)
GET  /api/orders/:id
PUT  /api/orders/:id/status     (vendor own / admin)
GET  /api/orders/:id/receipt    (buyer own / admin)
```

### Payments
```
POST /api/payments/initialize
GET  /api/payments/verify/:reference
POST /api/payments/webhook
```

### Admin (protected, admin only)
```
GET   /api/admin/dashboard
GET   /api/admin/users
GET   /api/admin/vendors
GET   /api/admin/products
GET   /api/admin/orders
PATCH /api/admin/vendors/:id/status
```

### Wishlist
```
GET    /api/wishlist
POST   /api/wishlist/:productId
DELETE /api/wishlist/:productId
```

---

## 🔒 Security

- Passwords hashed with **bcrypt**.
- **JWT** authentication with role-based middleware.
- Admin routes require the `admin` role (verified from the DB user).
- Vendors can only modify/delete their **own** products.
- Users can only access their **own** receipts; admins can access all.
- Paystack secret key, Cloudinary secrets, and SMTP credentials live **only** on the backend.
- Paystack amount, currency, and reference are verified **server-side**.
- Webhook payloads are verified with the Paystack **HMAC-SHA512** signature.

---

## 🧪 Testing Notes

- The frontend builds successfully with `npm run build`.
- Backend modules load cleanly; receipt generation produces valid PDFs.
- To test payments end-to-end you need real Paystack **test** keys, a running MongoDB, and (for receipts/emails) Cloudinary + SMTP credentials.

---

## ⚠️ Troubleshooting

- **`MongoDB connection error`** → check `MONGO_URI` and that MongoDB/Atlas is reachable.
- **Cloudinary upload fails** → verify your Cloudinary keys and network access.
- **Emails not arriving** → check SMTP settings and the provider's spam folder; email failures are logged but do **not** break checkout.
- **Payment stuck as `pending`** → ensure the Paystack webhook URL is reachable, or rely on the redirect + `/verify` flow.
