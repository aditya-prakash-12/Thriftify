import express from "express";
import Message from "../models/message.js";

const router = express.Router();

// Send a message
router.post("/", async (req, res) => {
  const { senderId, receiverId, productId, message } = req.body;

  if (!senderId || !receiverId || !productId || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      product: productId,
      message,
    });

    await newMessage.save();

    await newMessage.populate("sender", "firstName email");
    await newMessage.populate("receiver", "firstName email");
    await newMessage.populate("product", "title");

    res.status(201).json(newMessage);
  } catch (err) {
    console.error("Error sending message:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Get messages for a user
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate("sender", "firstName email")
      .populate("receiver", "firstName email")
      .populate("product", "title")
      .sort({ createdAt: -1 });

    res.status(200).json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Get messages for a specific conversation (between two users about a product)
router.get("/conversation", async (req, res) => {
  const { user1, user2, productId } = req.query;

  try {
    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2, product: productId },
        { sender: user2, receiver: user1, product: productId },
      ],
    })
      .populate("sender", "firstName email")
      .populate("receiver", "firstName email")
      .populate("product", "title")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    console.error("Error fetching conversation:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;