import express from "express";
import Product from "../models/product.js";
import cloudinary from "../config/cloudinary.js";
import Review from "../models/review.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import user from "../models/user.js";

const router = express.Router();

// Auth middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Get Cloudinary upload signature
router.get("/upload-signature", (req, res) => {
  const timestamp = Math.round((new Date).getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request({
    timestamp: timestamp,
    folder: 'products',
  }, process.env.CLOUDINARY_API_SECRET);

  res.json({
    signature,
    timestamp,
    api_key: process.env.CLOUDINARY_API_KEY,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  });
});

// create new product
router.post("/", auth, async (req, res) => {
  const { title, shortDescription, category, originalPrice, sellingPrice, details, image } = req.body;

  try {
    // image is now the Cloudinary URL
    const prod = new Product({
      title,
      shortDescription,
      category,
      originalPrice,
      sellingPrice,
      details,
      image,
      seller: req.user,
    });
    await prod.save();
    console.log("Product saved:", prod._id, "Seller:", req.user);
    res.status(201).json(prod);
  } catch (err) {
    console.error("Error in product creation:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// list products
router.get("/", async (req, res) => {
  try {
    console.log("GET /api/products called");
    
    // Fetch only unsold products
    const products = await Product.find({ sold: false })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    console.log("Products found:", products.length);
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get product by ID with populated seller
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("seller")
      .lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error("Error fetching product:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Update product
router.put("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { title, shortDescription, category, originalPrice, sellingPrice, details, image } = req.body;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user is the seller
    if (product.seller.toString() !== req.user) {
      return res.status(403).json({ message: "Not authorized to update this product" });
    }

    // Update fields
    if (title !== undefined) product.title = title;
    if (shortDescription !== undefined) product.shortDescription = shortDescription;
    if (category !== undefined) product.category = category;
    if (originalPrice !== undefined) product.originalPrice = originalPrice;
    if (sellingPrice !== undefined) product.sellingPrice = sellingPrice;
    if (details !== undefined) product.details = details;
    if (image !== undefined) product.image = image;

    await product.save();
    res.status(200).json(product);
  } catch (err) {
    console.error("Error updating product:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete product (Admin only)
router.delete("/:id", auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if admin
    const currentUser = await user.findById(req.user);
    if (!currentUser || currentUser.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    console.error("Error deleting product:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
