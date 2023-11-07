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
        type: mongoose.Schema.Types.ObjectId, //tipo ObjectId para hacer referencia al modelo Productos
        ref: 'product' //Nombre de la coleccion de products en base de datos en minúsculas y singular
      },
      cantidad: {
        type: Number,
        required: true
      }
    }
  ]
});


const CartModel = mongoose.model("Cart", carritoSchema);

export default CartModel
