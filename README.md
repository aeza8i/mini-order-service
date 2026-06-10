# 🧾 Mini Orders Service

A NestJS microservice using SQLite, Prisma ORM and CQRS + Event Sourcing.

This service exposes a clean REST API with Swagger documentation.

---

## 🚀 Features

- ⚡ Built with NestJS + TypeScript
- 🛠 CQRS + Event Sourcing
- 🗄 SQLite database
- 💎 Prisma ORM with migrations
- 📚 Swagger UI for API documentation
- 🧪 Clear project structure with separation of modules

---

## 🏁 Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/aeza8i/mini-order-service.git
cd mini-order-service
```

### 2️⃣ Install dependencies
```bash
npm install
npx prisma migrate dev --name init
npx prisma generate
npm start
```

### 3️⃣ Swagger Documentation
```
http://localhost:3000/docs
```

## 4️⃣ API Endpoints

| Method | Endpoint | Description                   |
|--------|----------|-------------------------------|
| `POST` | `/api/v1/orders` | Create a new order            |
| `PATCH` | `/api/v1/orders/:id/execute` | Execute an order              |
| `PATCH` | `/api/v1/orders/:id/cancel` | Cancel an order               |
| `GET` | `/api/v1/orders` | Get all orders with filtering |

Create order example (POST /orders):
```sh
curl --location 'http://localhost:3000/api/v1/orders' \
--header 'Content-Type: application/json' \
--data '{
    "originToken": "BTS",
    "destinationToken": "USDT",
    "amount": 100,
    "userId": "user1"
}'
```
Get orders example (GET /orders):
```sh
curl --location 'http://localhost:3000/api/v1/orders?status=EXECUTED&userid=user1'
```

### 5️⃣ Testing
```bash
npm run test
npm run test:e2e
```
