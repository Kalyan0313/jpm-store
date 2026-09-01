# JPM Store — E-Commerce Frontend

Frontend for JPM Store, built with **Next.js, React, TypeScript, and Redux Toolkit**.

The application handles the customer-facing side of the store, including product browsing, search, cart, wishlist, authentication, and checkout.

**Live:** https://jpm-store.vercel.app/

## Features

* Product browsing and category pages
* Product search and filtering
* Product detail pages
* Shopping cart
* Wishlist
* User authentication
* Checkout and order creation
* Responsive design
* Persistent cart and wishlist state

## Tech Stack

* Next.js
* React
* TypeScript
* Redux Toolkit
* CSS Modules
* REST APIs

## Architecture

The frontend is separated into pages, reusable components, application state, and API utilities.

```text
Next.js App
    │
    ├── Pages & Layouts
    │
    ├── React Components
    │
    ├── Redux Store
    │     ├── Auth
    │     ├── Cart
    │     └── Wishlist
    │
    └── API Layer
           │
           ▼
      Node.js / Express API
           │
           ▼
        MongoDB
```

## Project Structure

```text
jpm-store/
├── app/
│   ├── category/
│   ├── product/
│   ├── checkout/
│   ├── login/
│   ├── register/
│   ├── search/
│   └── wishlist/
│
├── components/
│   ├── Navbar/
│   ├── ProductCard/
│   ├── CartDrawer/
│   ├── SearchModal/
│   └── ...
│
├── store/
│   ├── store.js
│   ├── Providers.js
│   ├── authSlice.js
│   ├── cartSlice.js
│   └── wishlistSlice.js
│
└── utils/
    ├── api.js
    └── formatters.js
```

## Frontend → Backend

The frontend communicates with the Node.js/Express backend through REST APIs.

Main API areas include:

```text
Authentication
Products
Search
Orders
```

The API layer is kept separate from UI components so components don't need to handle request construction and response handling directly.

## State Management

Redux Toolkit is used for application-level state:

* Authentication
* Cart
* Wishlist

Cart and wishlist data are persisted in the browser so they survive page refreshes.

## Getting Started

### Install

```bash
npm install
```

### Environment

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### Run

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### Production Build

```bash
npm run build
npm run start
```

## Backend

The frontend requires the JPM Store Node.js backend for authentication, product management, and order operations.

Backend repository:

https://github.com/Kalyan0313/jpm-store

## What I Focused On

While building the frontend, I focused on keeping the UI reusable and keeping application state and API communication separate from individual components.

The project also gave me practical experience working with **Next.js App Router, Redux state management, REST API integration, authentication flows, and e-commerce checkout state**.

## Author

**Kalyan Mahato**

* Portfolio: https://kalyanbuilds.site/
* LinkedIn: https://www.linkedin.com/in/kalyan-mahato-366444244/
* GitHub: https://github.com/Kalyan0313
