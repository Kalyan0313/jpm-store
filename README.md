# JPM Store

A full-stack e-commerce application built with Next.js, TypeScript, Node.js, Express, and MongoDB.

The project focuses on the parts of an e-commerce system that go beyond the UI — authentication, API design, product management, cart and order workflows, inventory handling, validation, and backend error handling.

**Live:** [https://jpm-store.vercel.app/](https://jpm-store.vercel.app/)  
**GitHub:** [https://github.com/Kalyan0313/jpm-store](https://github.com/Kalyan0313/jpm-store)

## What I Built

- Product catalog with search, filtering, and product details
- User registration and authentication
- Role-based access for administrative operations
- Shopping cart and wishlist functionality
- Order creation and order history
- Product and inventory management
- REST APIs using Node.js and Express
- Request validation using Zod
- Password hashing with bcrypt
- JWT-based authentication
- Centralized API error handling
- Rate limiting and security middleware
- Responsive frontend using Next.js and TypeScript

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Redux Toolkit
- Tailwind CSS

### Backend
- Node.js
- Express.js
- REST APIs
- JWT
- Zod
- bcrypt

### Database
- MongoDB
- Mongoose

### Tools
- Git
- Docker
- Postman

## Architecture

The application is split into a Next.js frontend and a separate Node.js/Express backend.

```text
┌─────────────────────┐
│    Next.js App      │
│ React + TypeScript  │
└──────────┬──────────┘
           │ REST API
┌──────────▼──────────┐
│  Express Server     │
│                     │
│  Routes             │
│  Controllers        │
│  Services           │
│  Middleware         │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│     MongoDB         │
│     Mongoose        │
└─────────────────────┘
```

The backend keeps HTTP handling inside controllers while application logic is handled in service modules.

### Backend Structure
```text
jpm-backend/
└── src/
    ├── config/
    ├── controllers/
    ├── middlewares/
    ├── models/
    ├── routes/
    ├── services/
    ├── seed/
    ├── utils/
    ├── app.js
    └── server.js
```

**Request flow:**  
Request ↓ Route ↓ Middleware ↓ Controller ↓ Service ↓ Mongoose Model ↓ MongoDB

This keeps controllers focused on HTTP concerns while business logic stays in the service layer.

### Frontend Structure
```text
jpm-store/
├── app/
├── components/
├── hooks/
├── store/
├── utils/
└── public/
```

Redux Toolkit is used for application state such as authentication, cart, and wishlist data.

The frontend communicates with the backend through a small API layer rather than accessing the database directly.

## Key Engineering Decisions

### Layered Backend
Instead of putting business logic directly inside Express route handlers, the backend separates:
`Routes → Controllers → Services → Models`

This makes the code easier to understand and gives each layer a clear responsibility.

### Request Validation
API inputs are validated before reaching business logic.
This helps keep invalid data out of the application and gives clients predictable validation errors.

### Authentication
Authentication is handled on the backend using JWTs, with protected routes for authenticated users and role-based authorization for administrative operations.

### Inventory Handling
Product stock is validated on the server when an order is created rather than trusting values sent by the client.
This keeps inventory decisions on the backend where they belong.

### Error Handling
API errors are handled centrally so individual controllers don't need to implement the same error-response logic repeatedly.

### API Security
The backend includes security middleware such as:
- Helmet
- Rate limiting
- CORS configuration
- Request validation
- Password hashing
- Authentication middleware

## Main API Areas

### Authentication
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

User registration and authentication.

### Products
- `GET /api/v1/products`
- `GET /api/v1/products/:id`
- `POST /api/v1/products`
- `PUT /api/v1/products/:id`
- `DELETE /api/v1/products/:id`

Product discovery and administrative product management.

### Orders
- `POST /api/v1/orders`
- `GET /api/v1/orders`
- `GET /api/v1/orders/:id`

Order creation and order history.

The exact routes may vary slightly depending on the deployed API configuration.

## Database Models

The application uses MongoDB with Mongoose.
Main entities include:
- User
- Product
- Cart
- Order
- OrderItem

Products contain inventory information, while orders store the purchased product details and order state.

## Running Locally

1. **Clone the repository**
```bash
git clone https://github.com/Kalyan0313/jpm-store.git
cd jpm-store
```

2. **Backend setup**
```bash
cd jpm-backend
npm install
```

Create a `.env` file:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
```

Start the backend:
```bash
npm run dev
```

3. **Frontend setup**
Open another terminal:
```bash
cd jpm-store
npm install
```

Create a `.env` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

Start the frontend:
```bash
npm run dev
```

The application will be available at:  
`http://localhost:3000`

## What I Learned

This project helped me understand the difference between building features and building an application that has to keep its data and API behavior consistent.

The areas I spent the most time on were:
- Structuring a Node.js backend
- Separating controllers from business logic
- Designing MongoDB schemas
- Handling authentication and authorization
- Validating API input
- Managing cart and order state
- Handling inventory correctly
- Designing frontend/backend boundaries
- Thinking about error cases instead of only the happy path

## Project Status

This is a personal project built to practice and demonstrate full-stack development with a stronger focus on backend engineering.
The application is functional and deployed, with further improvements planned around testing, observability, and production hardening.

## Author

**Kalyan Mahato**  
Full-Stack Developer focused on Node.js, TypeScript, React, and Next.js.
- **Portfolio:** [https://kalyanbuilds.site/](https://kalyanbuilds.site/)
- **LinkedIn:** [https://www.linkedin.com/in/kalyan-mahato-366444244/](https://www.linkedin.com/in/kalyan-mahato-366444244/)
- **GitHub:** [https://github.com/Kalyan0313](https://github.com/Kalyan0313)
