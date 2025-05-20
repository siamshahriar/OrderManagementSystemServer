# E-commerce Backend API

This is the backend of a simple e-commerce application built with **Express.js** and **MongoDB**.

## 🔧 Technologies Used

- **Express.js**
- **MongoDB**
- **CORS**
- **dotenv**

## 🗂 Features

- Stores and manages orders placed from the frontend.
- Provides REST APIs to create, read, update, and delete order data.

## 🔌 API Endpoints

| Method | Endpoint               | Description                   |
| ------ | ---------------------- | ----------------------------- |
| GET    | `/orders`              | Fetch all orders              |
| POST   | `/orders`              | Add a new order               |
| DELETE | `/orders/:id`          | Delete an order by ID         |
| PUT    | `/orders/:id/increase` | Increase quantity of an order |
| PUT    | `/orders/:id/decrease` | Decrease quantity of an order |

## 🌐 CORS & Environment Variables

- **CORS** middleware is enabled to allow cross-origin requests from the frontend.
- **dotenv** is used to store sensitive configuration like the MongoDB URI.

## ⚙️ Setup Instructions

```bash
# Clone the repo
git clone https://github.com/your-username/your-backend-repo.git

# Install dependencies
npm install

# Create a .env file
MONGO_URI=your_mongo_connection_string

# Run the server
npm start
```
