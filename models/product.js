import mongoose, { model, Schema, models } from "mongoose";

const ProductSchema = new Schema({
  title: { type: String, required: true },
  decscription: { type: String },
  price: { type: Number, required: true },
});

export const Product = models.Product || model("Product", ProductSchema);
