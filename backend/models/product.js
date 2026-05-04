import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    shortDescription: { type: String },
    category: { type: String, enum: ["men", "women", "kids"], required: true },
    originalPrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    details: { type: String },
    image: { type: String }, // we will store base64 or URL
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    sold: { type: Boolean, default: false }, // Mark product as sold when delivered
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
