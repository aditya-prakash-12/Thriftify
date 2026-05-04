import express from "express";
import Review from "../models/review.js";

const router = express.Router();

// Add a review
router.post("/", async (req, res) => {
  const { userId, productId, rating, reviewText } = req.body;

  if (!userId || !productId || !rating || !reviewText) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newReview = new Review({
      user: userId,
      product: productId,
      rating,
      reviewText,
    });

    await newReview.save();

    await newReview.populate("user", "firstName");
    await newReview.populate("product", "title");

    res.status(201).json(newReview);
  } catch (err) {
    console.error("Error adding review:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Get reviews for a product
router.get("/product/:productId", async (req, res) => {
  const { productId } = req.params;

  try {
    const reviews = await Review.find({ product: productId })
      .populate("user", "firstName")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Get average rating for a product
router.get("/product/:productId/average", async (req, res) => {
  const { productId } = req.params;

  try {
    const reviews = await Review.find({ product: productId });

    if (reviews.length === 0) {
      return res.status(200).json({ averageRating: 0, totalReviews: 0 });
    }

    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    const average = sum / reviews.length;

    res.status(200).json({ averageRating: average, totalReviews: reviews.length });
  } catch (err) {
    console.error("Error fetching average rating:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all reviews for a seller (reviews on seller's products)
router.get("/seller/:sellerId/all", async (req, res) => {
  const { sellerId } = req.params;

  try {
    const Product = require("../models/product.js").default;
    
    // Get all products by this seller
    const sellerProducts = await Product.find({ seller: sellerId });
    const productIds = sellerProducts.map(p => p._id);

    // Get all reviews for these products
    const reviews = await Review.find({ product: { $in: productIds } })
      .populate("user", "firstName")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (err) {
    console.error("Error fetching seller reviews:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Get average rating for a seller (average of all ratings on seller's products)
router.get("/seller/:sellerId/average", async (req, res) => {
  const { sellerId } = req.params;

  try {
    const Product = require("../models/product.js").default;
    
    // Get all products by this seller
    const sellerProducts = await Product.find({ seller: sellerId });
    const productIds = sellerProducts.map(p => p._id);

    // Get all reviews for these products
    const reviews = await Review.find({ product: { $in: productIds } });

    if (reviews.length === 0) {
      return res.status(200).json({ averageRating: 0, totalReviews: 0 });
    }

    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    const average = sum / reviews.length;

    res.status(200).json({ averageRating: average, totalReviews: reviews.length });
  } catch (err) {
    console.error("Error fetching seller average rating:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;