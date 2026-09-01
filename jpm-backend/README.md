# JPM Store — Node.js Backend

REST API backend for JPM Store, built with **Node.js, Express, MongoDB, and Mongoose**.

The backend handles authentication, product management, search, inventory, and order workflows for the e-commerce application.

**Frontend:** https://jpm-store.vercel.app/
**Repository:** https://github.com/Kalyan0313/jpm-store

---

## Features

* User registration and login
* JWT-based authentication
* Role-based authorization for admin operations
* Product listing, filtering, sorting, and search
* Product and category management
* Cart and order workflow
* Inventory validation during order creation
* Request validation with Zod
* Password hashing with bcrypt
* Centralized error handling
* API rate limiting
* Security headers with Helmet
* MongoDB data persistence with Mongoose

---

## Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* Zod
* bcrypt
* Helmet
* express-rate-limit
* Winston

---

## Architecture

The backend follows a simple layered structure:

```text id="w9p5q4"
Client
  ↓
Routes
  ↓
Middleware
  ↓
Controllers
  ↓
Services
  ↓
Mongoose Models
  ↓
MongoDB
```

Controllers handle HTTP requests and responses, while services contain the main application logic.

This keeps the route handlers small and makes the business logic easier to maintain and test.

---

## Project Structure

```text id="m0u8oa"
jpm-backend/
└── src/
    ├── config/
    │   ├── env.js
    │   └── db.js
    │
    ├── controllers/
    │   ├── authController.js
    │   ├── productController.js
    │   ├── categoryController.js
    │   └── orderController.js
    │
    ├── middlewares/
    │   ├── auth.js
    │   ├── errorHandler.js
    │   ├── rateLimiter.js
    │   └── validate.js
    │
    ├── models/
    │   ├── User.js
    │   ├── Product.js
    │   ├── Category.js
    │   ├── Order.js
    │   └── Review.js
    │
    ├── routes/
    │   ├── authRoutes.js
    │   ├── productRoutes.js
    │   ├── categoryRoutes.js
    │   └── orderRoutes.js
    │
    ├── services/
    │   ├── authService.js
    │   ├── productService.js
    │   ├── categoryService.js
    │   └── orderService.js
    │
    ├── seed/
    │   └── seeder.js
    │
    ├── utils/
    │   ├── appError.js
    │   ├── catchAsync.js
    │   └── logger.js
    │
    ├── app.js
    └── server.js
```

---

## API

Base URL:

```text id="5rj6j7"
http://localhost:5000/api/v1
```

### Authentication

```text id="7f2h3k"
POST /auth/register
POST /auth/login
GET  /auth/me
POST /auth/logout
```

### Products

```text id="3j9s6p"
GET    /products
GET    /products/:id
GET    /products/search
GET    /products/category/:slug
POST   /products
PATCH  /products/:id
DELETE /products/:id
```

### Categories

```text id="p5z7x2"
GET    /categories
POST   /categories
PATCH  /categories/:id
DELETE /categories/:id
```

### Orders

```text id="q8m3la"
POST /orders
GET  /orders
GET  /orders/:id
```

Protected endpoints require authentication.

---

## Example: Create Order

```json id="2f6b9c"
{
  "orderItems": [
    {
      "product": "product_id",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "fullName": "John Doe",
    "street": "123 Example Street",
    "city": "Bengaluru",
    "state": "Karnataka",
    "postalCode": "560001",
    "phone": "+91 9876543210"
  },
  "paymentMethod": "COD"
}
```

The backend validates the request, verifies product availability, calculates the order total on the server, and creates the order.

---

## Data Models

The main MongoDB collections are:

### User

Stores user information, authentication credentials, roles, and address details.

### Product

Stores product information including:

* Name
* Description
* Price
* Category
* Stock
* Images
* Rating

### Category

Stores product categories and their slugs.

### Order

Stores:

* User
* Ordered products
* Quantities
* Shipping address
* Payment method
* Total amount
* Order status

### Review

Stores product reviews and associated user/product references.

---

## Validation & Error Handling

API requests are validated at the middleware layer using **Zod**.

Application errors are handled through a custom `AppError` class and centralized Express error middleware.

For asynchronous controllers, `catchAsync` is used to forward rejected promises to the error handler.

Example response:

```json id="b7v3nk"
{
  "status": "fail",
  "message": "Product not found"
}
```

---

## Authentication & Security

The backend includes several basic security measures:

* Password hashing with bcrypt
* JWT authentication
* Role-based authorization
* HTTP security headers with Helmet
* Rate limiting
* Request validation with Zod
* CORS configuration
* MongoDB query sanitization

Authentication and authorization are enforced on protected API routes rather than relying on the frontend.

---

## Database

MongoDB is used as the primary database with Mongoose for schema definition and database interaction.

Indexes are used on frequently queried fields such as product categories and searchable product fields.

---

## Getting Started

### 1. Clone the repository

```bash id="h5q2nm"
git clone https://github.com/Kalyan0313/jpm-store.git
cd jpm-store/jpm-backend
```

### 2. Install dependencies

```bash id="e3k7pa"
npm install
```

### 3. Configure environment variables

Create a `.env` file:

```env id="x4r8ms"
NODE_ENV=development
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:3000
```

Do not commit your `.env` file.

### 4. Seed the database

```bash id="n2v5qd"
npm run seed
```

### 5. Start the server

Development:

```bash id="r8k1cz"
npm run dev
```

Production:

```bash id="j6p3mw"
npm start
```

The API will be available at:

```text id="a9s4xe"
http://localhost:5000/api/v1
```

---

## What I Focused On

The main focus of this project was building a backend that is easy to understand and extend rather than putting all application logic inside Express route handlers.

Some of the areas I worked on were:

* Designing REST APIs
* Structuring Node.js services
* MongoDB schema design
* Authentication and authorization
* API validation
* Order and inventory workflows
* Centralized error handling
* Protecting API endpoints
* Connecting a separate Next.js frontend to the backend

---

## Future Improvements

Some areas I plan to improve further:

* Automated unit and integration tests
* Better inventory concurrency handling
* Payment gateway integration
* API documentation with Swagger
* CI checks with GitHub Actions
* Improved logging and monitoring

---

## License

MIT
