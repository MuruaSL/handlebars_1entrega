import mongoose from "mongoose";

const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  price: Number,
  code: {
    type: String,
    unique: true
  },
  stock: Number,
  status: Boolean,
  thumbnails: {
    type: [String],
    default: []
  }
});

const carritoSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },
  productos: [
    {
      producto: {
        type: [productoSchema] // Utilizamos el esquema de producto definido anteriormente
      },
      cantidad: {
        type: Number,
        required: true
      }
    }
  ]
});

const CartModel = mongoose.model("Carrito", carritoSchema);

export default CartModel
