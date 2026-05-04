import express from "express";
import user from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  const { firstName, lastName, username, email, phone, gender, city, state, country, password } = req.body;

  try {
    // Check if email or username exists
    if (await user.findOne({ email })) return res.status(400).json({ message: "Email already registered" });
    if (await user.findOne({ username })) return res.status(400).json({ message: "username already taken" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newuser = new user({
      firstName,
      lastName,
      username,
      email,
      phone,
      gender,
      city,
      state,
      country,
      password: hashedPassword,
    });

    await newuser.save();

    res.status(201).json({ message: "user registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  // allow user to login with either username or email
  const { username, password } = req.body;

  try {
    const currentUser = await user.findOne({
      $or: [{ email: username }, { username: username }],
    });
    if (!currentUser) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, currentUser.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // JWT
    const token = jwt.sign({ id: currentUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // include user details in the response so the client can manage profile data
    res.status(200).json({
      token,
      user: {
        _id: currentUser._id,
        username: currentUser.username,
        email: currentUser.email,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        phone: currentUser.phone,
        gender: currentUser.gender,
        city: currentUser.city,
        state: currentUser.state,
        country: currentUser.country,
        role: currentUser.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// VERIFY TOKEN
router.get("/verify", async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await user.findById(decoded.id);
    if (!currentUser) return res.status(401).json({ message: "Invalid token" });

    res.status(200).json({
      user: {
        _id: currentUser._id,
        username: currentUser.username,
        email: currentUser.email,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        phone: currentUser.phone,
        gender: currentUser.gender,
        city: currentUser.city,
        state: currentUser.state,
        country: currentUser.country,
      },
    });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// GET ALL USERS (Admin only)
router.get("/all", async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await user.findById(decoded.id);
    if (!currentUser || currentUser.role !== 'admin') return res.status(403).json({ message: "Admin access required" });

    const allUsers = await user.find().select('-password');
    res.status(200).json(allUsers);
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// DELETE USER (Admin only)
router.delete("/:userId", async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await user.findById(decoded.id);
    if (!currentUser || currentUser.role !== 'admin') return res.status(403).json({ message: "Admin access required" });

    await user.findByIdAndDelete(req.params.userId);
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET USER DETAILS WITH PRODUCTS AND ORDERS (Admin only)
router.get("/details/:userId", async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await user.findById(decoded.id);
    if (!currentUser || currentUser.role !== 'admin') return res.status(403).json({ message: "Admin access required" });

    const userDetails = await user.findById(req.params.userId).select('-password');
    if (!userDetails) return res.status(404).json({ message: "User not found" });

    res.status(200).json(userDetails);
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// UPDATE USER (Admin only)
router.put("/:userId", async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await user.findById(decoded.id);
    if (!currentUser || currentUser.role !== 'admin') return res.status(403).json({ message: "Admin access required" });

    const updateData = req.body;
    delete updateData.password;
    delete updateData._id;
    delete updateData.role;

    const updatedUser = await user.findByIdAndUpdate(
      req.params.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(401).json({ message: "Invalid token or server error" });
  }
});

// UPDATE PROFILE
router.put("/profile/:userId", async (req, res) => {
  const { userId } = req.params;
  const updateData = req.body;

  try {
    // Remove sensitive fields that shouldn't be updated
    delete updateData.password;
    delete updateData._id;

    const updatedUser = await user.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        phone: updatedUser.phone,
        gender: updatedUser.gender,
        city: updatedUser.city,
        state: updatedUser.state,
        country: updatedUser.country,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    if (error.code === 11000) {
      res.status(400).json({ message: "Username or email already exists" });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
});

// GET USER BY ID
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const currentUser = await user.findById(userId);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      _id: currentUser._id,
      username: currentUser.username,
      email: currentUser.email,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      phone: currentUser.phone,
      gender: currentUser.gender,
      city: currentUser.city,
      state: currentUser.state,
      country: currentUser.country,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/verify", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer token

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET not configured");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await user.findById(decoded.id);

    if (!currentUser) {
      return res.status(401).json({ message: "User not found" });
    }

    res.status(200).json({
      user: {
        _id: currentUser._id,
        username: currentUser.username,
        email: currentUser.email,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        phone: currentUser.phone,
        gender: currentUser.gender,
        city: currentUser.city,
        state: currentUser.state,
        country: currentUser.country,
      },
    });
  } catch (error) {
    console.error("Token verification error:", error.message);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

export default router;