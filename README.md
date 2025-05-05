# 💳 CrediKhaata - Credit Management Backend

CrediKhaata is a Node.js-based backend API for managing customers, issuing loans, recording repayments, and tracking overdue amounts. It is designed for small businesses or shopkeepers to manage customer credits efficiently. The project uses Express.js, MongoDB, and JWT authentication.

---

## 🚀 Features

- User registration & login (JWT-based authentication)
- Customer management (CRUD)
- Loan issuance & tracking
- Repayment recording
- Summary statistics & overdue loans
- Protected routes using JWT
- Swagger documentation for all endpoints

---

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **dotenv** for environment variable management
- **Swagger** for API documentation

---

## 📦 Dependencies

```bash
npm install
```

| Package      | Purpose                     |
| ------------ | --------------------------- |
| express      | Web framework               |
| mongoose     | MongoDB ODM                 |
| dotenv       | Environment variable loader |
| bcryptjs     | Password hashing            |
| jsonwebtoken | JWT token handling          |

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/credikhaata-backend.git
cd credikhaata-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
PORT=10000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRY=1d
TWILIO_ACCOUNT_SID=your_acc_id
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=twilio_ph_num
TO_PHONE_NUMBER=your_ph_num
```

### 4. Start the server

```bash
npm run dev
```

Server will start at: `http://localhost:10000`

---

## 📘 API Documentation

Full interactive docs available at:

> `https://creditkhaata-backend.onrender.com/api-docs`

### 🔐 Auth Routes

| Method | Endpoint                | Description             |
| ------ | ----------------------- | ----------------------- |
| POST   | `/api/v1/auth/register` | Register a new user     |
| POST   | `/api/v1/auth/login`    | Login and receive token |

---

### 👥 Customer Routes (Protected)

| Method | Endpoint                | Description          |
| ------ | ----------------------- | -------------------- |
| GET    | `/api/v1/customers/`    | Get all customers    |
| POST   | `/api/v1/customers/`    | Create new customer  |
| PUT    | `/api/v1/customers/:id` | Update customer info |
| DELETE | `/api/v1/customers/:id` | Delete a customer    |

---

### 💰 Loan Routes (Protected)

| Method | Endpoint         | Description      |
| ------ | ---------------- | ---------------- |
| GET    | `/api/v1/loans/` | Get all loans    |
| POST   | `/api/v1/loans/` | Issue a new loan |

---

### 💸 Repayment Routes (Protected)

| Method | Endpoint              | Description             |
| ------ | --------------------- | ----------------------- |
| GET    | `/api/v1/repayments/` | Get all repayments      |
| POST   | `/api/v1/repayments/` | Record a loan repayment |

---

### 📊 Stats Routes (Protected)

| Method | Endpoint                | Description               |
| ------ | ----------------------- | ------------------------- |
| GET    | `/api/v1/stats/summary` | Get system summary stats  |
| GET    | `/api/v1/stats/overdue` | Get list of overdue loans |

---

## 📎 Notes

- Use [Postman](https://www.postman.com/) or Swagger UI to test endpoints.
- Make sure MongoDB is running locally or use a cloud instance (like MongoDB Atlas).
- JWT token is required for all routes except `/register` and `/login`.
- Pass the token in `Authorization` header as:  
  `Bearer <your_token>`

---

## 📄 License

This project is licensed under the MIT License.
