import express from "express";
import Order from "../models/order.js";
import Product from "../models/product.js";
import jwt from "jsonwebtoken";
import user from "../models/user.js";

const router = express.Router();

// Create new order
router.post("/", async (req, res) => {
  const {
    buyerId,
    products,
    totalAmount,
    paymentMethod,
    shippingAddress,
    orderNotes,
  } = req.body;

  if (!buyerId || !Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ message: 'Invalid order payload: buyerId and products are required' });
  }

  try {
    // Validate products and get seller information
    const orderProducts = [];
    let sellerId = null;

    for (const item of products) {
      const product = await Product.findById(item.productId).populate("seller");
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }

      // Get seller ID from product
      let productSellerId = null;
      if (product.seller) {
        productSellerId = product.seller._id ? product.seller._id.toString() : product.seller.toString();
      }

      if (!productSellerId) {
        console.error(`Seller missing for product ${item.productId}:`, product);
        return res.status(400).json({ 
          message: `Product ${item.productId} doesn't have a seller assigned. Please contact support.` 
        });
      }

      if (!sellerId) {
        sellerId = productSellerId;
      } else if (sellerId !== productSellerId) {
        return res.status(400).json({
          message: "All products in an order must be from the same seller"
        });
      }

      orderProducts.push({
        product: product._id,
        quantity: item.quantity,
        price: item.price,
        title: product.title,
        image: product.image,
      });
    }

    const order = new Order({
      buyer: buyerId,
      seller: sellerId,
      products: orderProducts,
      totalAmount,
      paymentMethod,
      shippingAddress,
      orderNotes,
    });

    await order.save();

    // Populate seller info for response
    await order.populate("buyer", "firstName email");
    await order.populate("seller", "firstName email");

    res.status(201).json(order);
  } catch (err) {
    console.error("Error creating order:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get orders for a user (buyer or seller)
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  const { type = "buyer" } = req.query; // "buyer" or "seller"

  try {
    const filter = type === "seller" ? { seller: userId } : { buyer: userId };

    const orders = await Order.find(filter)
      .populate("buyer", "firstName email")
      .populate("seller", "firstName email")
      .populate("products.product")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Update order status (for sellers)
router.patch("/:orderId/status", async (req, res) => {
  const { orderId } = req.params;
  const { status, sellerId } = req.body;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verify the seller owns this order
    if (order.seller.toString() !== sellerId) {
      return res.status(403).json({ message: "Unauthorized to update this order" });
    }

    order.status = status;
    await order.save();

    // If order is delivered, mark products as sold
    if (status === 'delivered') {
      for (const orderProduct of order.products) {
        await Product.findByIdAndUpdate(orderProduct.product, { sold: true });
      }
    }

    await order.populate("buyer", "firstName email");
    await order.populate("seller", "firstName email");
    await order.populate("products.product");

    res.status(200).json(order);
  } catch (err) {
    console.error("Error updating order status:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all orders (Admin only)
router.get("/all", async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await user.findById(decoded.id);
    if (!currentUser || currentUser.role !== 'admin') return res.status(403).json({ message: "Admin access required" });

    const orders = await Order.find()
      .populate("buyer", "firstName email")
      .populate("seller", "firstName email")
      .populate("products.product")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching all orders:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Update order status (Admin)
router.patch("/:orderId/admin-status", async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await user.findById(decoded.id);
    if (!currentUser || currentUser.role !== 'admin') return res.status(403).json({ message: "Admin access required" });

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    await order.populate("buyer", "firstName email");
    await order.populate("seller", "firstName email");
    await order.populate("products.product");

    res.status(200).json(order);
  } catch (err) {
    console.error("Error updating order status:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single order
router.get("/:orderId", async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId)
      .populate("buyer", "firstName email")
      .populate("seller", "firstName email")
      .populate("products.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (err) {
    console.error("Error fetching order:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;