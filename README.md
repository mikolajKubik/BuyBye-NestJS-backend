# 🛍️ Buy&Bye

**Buy&Bye** is a simple **CRUD-based store backend** built with **NestJS** (Node.js framework).  
It provides a REST API for managing **products**, **categories**, and **orders**, and includes a **Docker setup** with **Oracle MySQL** for quick deployment.

---

## 🐳 Run with Docker (NestJS + Oracle MySQL)

Spin up the full backend environment (API + Oracle MySQL DB):

```bash
docker compose up -d
# To stop and remove DB volume:
docker compose down -v
```

This setup includes:
- NestJS API server
- Oracle MySQL (community edition) database
- Pre-configured environment for local development

---

## 💻 Run Locally

> Node.js version: `v20.18.0`

### 1️⃣ Install dependencies:

```bash
npm i -g @nestjs/cli
npm install --save @nestjs/typeorm typeorm mysql2
npm i --save class-validator class-transformer
npm i --save @nestjs/config
```

### 2️⃣ Deploy Oracle MySQL (locally or via Docker)  
Ensure the Oracle MySQL container is running with the same env variables.

### 3️⃣ Start the app

```bash
# Development mode (with file watching)
npm run start:dev

# Production mode
npm run start:prod
```

---

## ⚙️ Environment Variables (`.env`)

```env
PORT=3000

DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=aji-user
DATABASE_PASSWORD=your_password
DATABASE_NAME=aji-db

TYPEORM_SYNC=true
```

---

## 🗂️ Database Schema

![Database Schema](./diagram.svg)  
Schema available via [dbdiagram.io](https://dbdiagram.io)

---

## 🧪 API Endpoints

### 📡 Status
`GET /status`

---

### 🏷️ Categories
`GET /categories`

---

### 📦 Products

- `GET /products`
- `GET /products/:UUID`
- `POST /products`
```json
{
    "name": "example2",
    "description": "This is a sample product description.",
    "price": 369.99,
    "weight": 15.99,
    "categoryName": "Books",
    "stock": 10
}
```

- `PUT /products/:UUID`
```json
{
    "name": "example2",
    "description": "This is a sample product description.",
    "price": 369.99,
    "weight": 15.99,
    "categoryName": "Books",
    "stock": 10
}
```

---

### 📑 Orders

- `GET /orders`
- `GET /orders/:UUID`
- `POST /orders`
```json
{
    "username": "john doe",
    "email": "john.doe@example.com",
    "phone": "1234567890",
    "products": [
        {
            "id": "UUID",
            "quantity": 1
        },
        {
            "id": "UUID",
            "quantity": 3
        }
    ]
}
```

- `PUT /orders/:id` (only ORDER entity)
```json
{
  "username": "Updated User",
  "email": "updated.email@example.com",
  "phone": "1234567890",
  "statusName": "UNCONFIRMED"
}
```

- `GET /orders/status/:statusNAME`  
  Status options: `UNCONFIRMED`, `CONFIRMED`, `COMPLETED`, `CANCELLED`

- `PUT /orders/:orderUUID/products/:productUUID`  
  Edit product quantity in the order:
```json
{
  "quantity": 80
}
```

- `DELETE /orders/:orderUUID/products/:productUUID`  
  Remove a product entirely from an order.
