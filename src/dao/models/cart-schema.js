import mongoose from "mongoose";

const carritoSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products' // Cambiado de 'Product' a 'products'
      },
      cantidad: {
        type: Number,
        required: true
      }
    }
  ]
});

// Registra el modelo de carritos
const CartModel = mongoose.model("Cart", carritoSchema);

export default CartModel;
