# Shoe Shop API 👟🛒

## Table of Contents

- [Shoe Shop API 👟🛒](#shoe-shop-api-)
  - [Table of Contents](#table-of-contents)
  - [Features ✨](#features-)
  - [Tech Stack 🛠️](#tech-stack-️)
  - [Getting Started 🚀](#getting-started-)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Project Structure](#project-structure)

A RESTful e-commerce API for a shoe store built with Node.js, Express, and MongoDB.

## Features ✨

- **User Authentication**
  - JWT-based login/register
  - Email verification
  - Password reset
  - Role-based access (user/admin)
- **Product Management**

  - CRUD operations for products
  - Categories, brands
  - Image uploads (Cloudinary)

- **Order System**

  - Checkout process
  - Payment integration (Stripe/PayPal)
  - Order history

- **Security**
  - Rate limiting
  - CSRF protection
  - Data sanitization

## Tech Stack 🛠️

**Backend:**

- Node.js
- Express
- MongoDB (Mongoose)
- Redis (caching/sessions)

**Authentication:**

- JSON Web Tokens (JWT)
- Bcrypt (password hashing)

**DevOps:**

- Vercel deployment

## Getting Started 🚀

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas or local instance
- Redis

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Ssaava/shoe-shop-api.git
   cd shoe-shop-api
   ```

2. Install Dependencies:

   ```bash
   npm install
   ```

3. Create .env file:

   ```bash
   MONGO_DB_URL=
   PORT=5000
   EMAIL_USER=
   EMAIL_PASSWORD=
   SERVER_URL=http://localhost:5000
   TOKEN_SECRET_KEY=
   REFRESH_TOKEN_SECRET=

   ```

4. Start the Server:

   ```bash
   npm run dev
   ```

## Project Structure

```bash
shoe-shop-api/
├── config/ # Database and environment configs
├── controllers/ # Route controllers
├── middlewares/ # Custom middleware
├── models/ # MongoDB models
├── routes/ # API routes
├── utils/ # Helper functions
├── services/ # Services
└── api/index.js # Express app setup and Server entry point
```
