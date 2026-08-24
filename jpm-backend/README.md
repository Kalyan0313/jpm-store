# JPM Store Backend — Production Grade Node.js, Express & MongoDB REST API

This repository houses the production-grade RESTful API backend for **JPM Store** built using **Node.js**, **Express.js**, **MongoDB**, and **Mongoose**.

The system is architected following **SOLID principles**, **Clean Layered Architecture**, **OWASP Security Best Practices**, **Zod Data Validation**, and **Atomic Concurrency Controls**.

---

## Technical Table of Contents

- [Architectural Principles & Design Patterns](#architectural-principles--design-patterns)
- [Threat Model & Security Mitigation Matrix](#threat-model--security-mitigation-matrix)
- [Database Data Models & Indexing Strategy](#database-data-models--indexing-strategy)
- [Error Handling & Resilience Architecture](#error-handling--resilience-architecture)
- [Directory Architecture](#directory-architecture)
- [REST API Reference & Sample Payloads](#rest-api-reference--sample-payloads)
- [Environment Configuration & Deployment](#environment-configuration--deployment)
- [Developer Quick Start](#developer-quick-start)
- [License](#license)

---

## Architectural Principles & Design Patterns

### 1. Clean Layered Architecture
The application enforces strict unidirectional dependencies across decoupled architectural layers:

```text
[ Client Request ] ──► [ Security & Validation Middlewares ]
                                    │
                                    ▼
                           [ Controllers ]         ── HTTP Transport & Serialization
                                    │
                                    ▼
                            [ Service Layer ]      ── Pure Business & Transactional Logic
                                    │
                                    ▼
                     [ Repositories / Mongoose ]   ── Data Access & Query Execution
                                    │
                                    ▼
                         [ MongoDB Database ]      ── Persistence Store
```

### 2. SOLID Principles Implementation
- **Single Responsibility Principle (SRP)**:
  - **Controllers** (`src/controllers/`): Extract request parameters, invoke domain services, and return formatted HTTP responses. Zero business rules.
  - **Services** (`src/services/`): Execute core domain logic, atomic inventory updates, and token generation. Zero HTTP or database transport dependencies.
  - **Models** (`src/models/`): Define schema constraints, pre-save encryption hooks, index declarations, and instance methods.
  - **Middlewares** (`src/middlewares/`): Enforce security headers, rate limiting, JWT verification, and error interception.
- **Open/Closed Principle (OCP)**: Modular routing files (`src/routes/`) allow registering new domain routes without modifying existing controller logic.
- **Dependency Inversion Principle (DIP)**: Controller functions interact with high-level service interfaces rather than directly executing database queries.

---

## Threat Model & Security Mitigation Matrix

| Attack Vector / Vulnerability | Potential Impact | Production Mitigation Implementation |
|---|---|---|
| **NoSQL Query Injection** | Unauthorized data leakage or query manipulation via operator injection (`$gt`, `$ne`). | **`express-mongo-sanitize`** middleware automatically strips dollar signs and dots from incoming `req.body`, `req.query`, and `req.params`. |
| **XSS & JWT Token Theft** | Session hijacking via malicious client-side script execution. | **HttpOnly, SameSite=Strict, Secure Cookies**: JWT tokens are transmitted exclusively in HTTP cookies inaccessible to `document.cookie`. |
| **Brute-Force & DDoS** | Authentication endpoint flooding or resource exhaustion. | **`express-rate-limit`**: Enforces a threshold of 20 auth requests per hour and 200 general API requests per 15 minutes per IP address. |
| **HTTP Header Attacks** | Clickjacking, MIME-sniffing, and cross-site scripting vulnerabilities. | **`helmet`**: Inject security headers including `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and HSTS. |
| **Payload Data Corruption** | Unexpected runtime type errors or malformed database inserts. | **`Zod` Schema Validation**: Runtime validation rejects invalid types at the transport boundary before hitting business logic. |
| **Uncaught Exception Crashes** | Server process crashing on unhandled promise rejections. | **Global Error Handlers**: Process-level `uncaughtException` and `unhandledRejection` listeners trigger graceful HTTP server shutdown. |

---

## Database Data Models & Indexing Strategy

### 1. User Model (`User.js`)
- **Fields**: `name` (String), `email` (String, unique, indexed), `password` (String, select: false), `role` (Enum: `['user', 'admin']`), `address` (Object).
- **Pre-save Hook**: Automatically hashes passwords using `bcryptjs` with a cost factor of 12 prior to persistence.
- **Instance Method**: `correctPassword(candidatePassword, userPassword)` executes secure `bcrypt.compare`.

### 2. Product Model (`Product.js`)
- **Fields**: `title` (String), `slug` (String, unique), `description` (String), `price` (Number), `discountPercentage` (Number), `rating` (Number), `stock` (Number), `brand` (String), `category` (String, indexed), `thumbnail` (String), `images` (Array of Strings).
- **Text Search Index**: Compound full-text index on `{ title: 'text', description: 'text', brand: 'text' }`.
- **Compound Index**: `{ category: 1, price: 1 }` for high-speed category filtering and price sorting.

### 3. Order Model (`Order.js`)
- **Fields**: `user` (Ref: User), `orderItems` (Array of Product sub-documents), `shippingAddress` (Object), `paymentMethod` (Enum: `['COD', 'Card', 'UPI', 'NetBanking']`), `totalAmount` (Number), `isPaid` (Boolean), `orderStatus` (Enum: `['Processing', 'Shipped', 'Delivered', 'Cancelled']`).
- **Concurrency Control**: Order creation executes an atomic conditional update (`Product.findOneAndUpdate({ _id, stock: { $gte: qty } }, { $inc: { stock: -qty } })`) preventing inventory overselling.

---

## Error Handling & Resilience Architecture

The system distinguishes between **Operational Errors** (expected client/business failures) and **Programmer Errors** (unexpected runtime exceptions):

- **Custom `AppError` Class**: Extends native `Error` with `statusCode`, `status` (`fail`/`error`), and `isOperational = true`.
- **`catchAsync` Wrapper**: Higher-order function wrapping async controllers to automatically route unhandled promise rejections to the global error middleware without `try/catch` boilerplate.
- **Global Error Middleware**: Formats standardized error envelopes:
  ```json
  {
    "status": "fail",
    "message": "Resource with ID 6a8c3900ac71bd86b811b193 not found"
  }
  ```
- **Zero-Downtime DB Fallback**: If local or cloud MongoDB is unreachable, the system initializes an in-memory MongoDB instance (`mongodb-memory-server`) and automatically seeds initial catalog data.

---

## Directory Architecture

```text
jpm-backend/
├── src/
│   ├── config/
│   │   ├── env.js          # Zod environment variable parsing & validation
│   │   └── db.js           # Mongoose connection & in-memory DB fallback
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, logout, profile
│   │   ├── productController.js  # Product query, search, filtering, CRUD
│   │   ├── categoryController.js # Category retrieval
│   │   └── orderController.js    # Order submission & stock management
│   ├── middlewares/
│   │   ├── auth.js          # JWT verification & role authorization (RBAC)
│   │   ├── errorHandler.js  # Centralized global error handling
│   │   ├── rateLimiter.js   # Express rate limiters
│   │   └── validate.js      # Zod schema validation middleware
│   ├── models/
│   │   ├── User.js          # User schema with bcrypt pre-save hashing
│   │   ├── Product.js       # Product schema with text indexes & virtuals
│   │   ├── Category.js      # Category schema with auto-slug generation
│   │   ├── Order.js         # Order schema with atomic stock updates
│   │   └── Review.js        # Review schema with compound constraint
│   ├── routes/
│   │   ├── authRoutes.js    # /api/v1/auth
│   │   ├── productRoutes.js # /api/v1/products
│   │   ├── categoryRoutes.js# /api/v1/categories
│   │   └── orderRoutes.js   # /api/v1/orders
│   ├── services/
│   │   ├── authService.js    # JWT generation & authentication rules
│   │   ├── productService.js # Search, pagination, sorting & filter pipeline
│   │   ├── categoryService.js# Category domain logic
│   │   └── orderService.js   # Order processing & inventory verification
│   ├── seed/
│   │   └── seeder.js         # CLI and automatic catalog seeder
│   ├── utils/
│   │   ├── appError.js       # Custom operational error class
│   │   ├── catchAsync.js     # Async controller exception wrapper
│   │   └── logger.js         # Winston JSON structured logger
│   ├── app.js               # Express application middleware assembly
│   └── server.js            # Node HTTP server entry point & signal handlers
├── .env                     # Environment configuration
├── package.json
└── README.md
```

---

## REST API Reference & Sample Payloads

### Base Endpoint: `http://localhost:5000/api/v1`

#### 1. User Registration
`POST /api/v1/auth/register`

**Request Body:**
```json
{
  "name": "Senior Engineer",
  "email": "senior@jpmstore.com",
  "password": "Password123!"
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "_id": "6a8c390df6b03198b1e94da3",
      "name": "Senior Engineer",
      "email": "senior@jpmstore.com",
      "role": "user"
    }
  }
}
```

#### 2. Product Search & Filtering
`GET /api/v1/products?category=smartwatches&sort=price-asc&page=1&limit=10`

**Response (200 OK):**
```json
{
  "status": "success",
  "results": 3,
  "total": 3,
  "page": 1,
  "totalPages": 1,
  "data": {
    "products": [
      {
        "_id": "6a8c3900ac71bd86b811b191",
        "title": "Samsung Galaxy Watch 6 Classic",
        "slug": "samsung-galaxy-watch-6-classic",
        "price": 349,
        "category": "smartwatches",
        "stock": 30
      }
    ]
  }
}
```

#### 3. Order Placement
`POST /api/v1/orders`  
*Requires Authorization Header: `Bearer <JWT_TOKEN>`*

**Request Body:**
```json
{
  "orderItems": [
    {
      "product": "6a8c3900ac71bd86b811b191",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "fullName": "Senior Engineer",
    "street": "123 Tech Avenue",
    "city": "Bengaluru",
    "state": "Karnataka",
    "postalCode": "560001",
    "phone": "+91 98765 43210"
  },
  "paymentMethod": "COD"
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "data": {
    "order": {
      "_id": "6a8c3915f6b03198b1e94da9",
      "user": "6a8c390df6b03198b1e94da3",
      "totalAmount": 349,
      "orderStatus": "Processing"
    }
  }
}
```

---

## Environment Configuration & Deployment

Create a `.env` file in the project root:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jpm_store
JWT_SECRET=jpm_store_super_secret_jwt_key_2026_production_grade_security!
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7
CORS_ORIGIN=http://localhost:3000
```

---

## Developer Quick Start

### 1. Install Dependencies
```bash
cd jpm-backend
npm install
```

### 2. Seed Database
```bash
npm run seed
```

### 3. Launch Development Server
```bash
npm run dev
```

The API will be available at `http://localhost:5000/api/v1`.

---

## License

This software is distributed under the **MIT License**.
