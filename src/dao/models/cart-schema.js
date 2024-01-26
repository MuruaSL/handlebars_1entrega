import mongoose from "mongoose";

const carritoSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },
  productos: [
    {
      producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
      },
      cantidad: {
        type: Number,
        required: true
      }
    },
  ],
  total: Number
});

// Registra el modelo de carritos
const CartModel = mongoose.model("Cart", carritoSchema);

export default CartModel;
