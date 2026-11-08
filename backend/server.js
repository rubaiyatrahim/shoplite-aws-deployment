const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/shoplite";

// Middleware
app.use(cors()); // Allows your frontend to talk to this API
app.use(express.json()); // Parses incoming JSON payloads

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define the Data Model
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
});
const Product = mongoose.model("Product", productSchema);

// REST API Routes

// 1. Get all products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("GET Error:", error); // <-- Add this to reveal the error
    res
      .status(500)
      .json({ error: "Failed to fetch products", details: error.message });
  }
});

// 2. Add a new product
app.post("/products", async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Failed to create product" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Backend API running on port ${PORT}`);
});
