const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const { query } = require("express");
require("dotenv").config();

const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

/* --- MongoDB ---- */
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const ordersCollection = client
      .db("orderManagementSystem")
      .collection("orders");

    // Create a new order or update an existing one
    app.post("/orders", async (req, res) => {
      try {
        const { product, quantity } = req.body;
        // Find if order with the same product.id already exists
        const existingOrder = await ordersCollection.findOne({
          "product.id": product.id,
        });

        if (existingOrder) {
          // If found, update quantity
          const updatedOrder = await ordersCollection.updateOne(
            { _id: existingOrder._id },
            { $inc: { quantity: quantity } }
          );
          res.status(200).send({
            message: "Order updated successfully (quantity increased)",
            updatedOrderId: existingOrder._id,
          });
        } else {
          // If not found, insert new order
          const result = await ordersCollection.insertOne({
            product,
            quantity,
          });
          res.status(201).send({
            message: "Order placed successfully",
            insertedId: result.insertedId,
          });
        }
      } catch (error) {
        res
          .status(500)
          .send({ error: "Failed to place order", details: error.message });
      }
    });

    //Get all orders
    app.get("/orders", async (req, res) => {
      try {
        const query = {};
        const orders = await ordersCollection.find(query).toArray();
        res.status(200).send(orders);
      } catch (error) {
        res
          .status(500)
          .send({ error: "Failed to retrieve orders", details: error.message });
      }
    });

    //Delete an order
    app.delete("/orders/:id", async (req, res) => {
      try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ error: "Invalid order ID" });
        }
        const query = { _id: new ObjectId(id) };
        const result = await ordersCollection.deleteOne(query);
        if (result.deletedCount === 0) {
          return res.status(404).send({ error: "Order not found" });
        }
        res.send({ message: "Order deleted successfully" });
      } catch (error) {
        res
          .status(500)
          .send({ error: "Delete failed", details: error.message });
      }
    });

    //increase quantity
    app.put("/orders/:id/increase", async (req, res) => {
      try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ error: "Invalid order ID" });
        }
        const query = { _id: new ObjectId(id) };
        const result = await ordersCollection.updateOne(
          query,
          { $inc: { quantity: 1 } },
          { upsert: true }
        );
        res.send({ message: "Order quantity increased successfully" });
      } catch (error) {
        res.status(500).send({
          error: "Failed to increase order quantity",
          details: error.message,
        });
      }
    });

    //decrease quantity
    app.put("/orders/:id/decrease", async (req, res) => {
      try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ error: "Invalid order ID" });
        }
        const query = { _id: new ObjectId(id) };
        const result = await ordersCollection.updateOne(
          query,
          { $inc: { quantity: -1 } },
          { upsert: true }
        );
        res.send({ message: "Order quantity decreased successfully" });
      } catch (error) {
        res.status(500).send({
          error: "Failed to decrease order quantity",
          details: error.message,
        });
      }
    });
  } finally {
  }
}

run().catch(console.log);

//Basic server start
app.get("/", async (req, res) => {
  res.send("order management server is running");
});

app.listen(port, () =>
  console.log(`order management server running on ${port}`)
);
