// cartService.js
import UserModel from "../models/user-schema.js"
import ProductsModel from "../models/products-schema.js"
import CartModel from "../models/cart-schema.js";
import { logger } from "../../logger.js";

class CartService {
  async createCart(cartData) {
    try {
      const newCart = new CartModel(cartData);
      const savedCart = await newCart.save();
      return savedCart;
    } catch (error) {
      throw new Error("Error al crear el carrito: " + error.message);
    }
  }

  async addToCart(cid, pid, productData, userId) {
    try {
      const quantity = productData.cantidad;
      const cart = await CartModel.findById(cid);
  
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
  
      if (!cart.productos || !Array.isArray(cart.productos)) {
        cart.productos = [];
      }
  
      const existingProduct = cart.productos.find((product) => product && product.producto && product.producto === pid);
  
      // Verificar si el usuario es premium
      const user = await UserModel.findById(userId);
      if (user.role === 'premium') {
        // Obtener el producto que se está intentando agregar al carrito
        const product = await ProductsModel.findById(pid);
  
        // Verificar si el producto le pertenece al usuario premium
        if (product.owner.toString() === userId) {

          logger.fatal('No puedes agregar tu propio producto al carrito');
          throw new Error("No puedes agregar tu propio producto al carrito");
        }
      }
  
      if (existingProduct) {
        existingProduct.cantidad += quantity;
      } else {
        const productData = {
          producto: pid, // Aquí utilizamos pid en lugar de productId
          cantidad: quantity,
        };
        cart.productos.push(productData);
      }
  
      const updatedCart = await cart.save();
      return updatedCart;
    } catch (error) {
      throw  Error(error.message);
    }
}

  async getCartById(cid) {
    try {
      return await CartModel.findById(cid).exec();
    } catch (error) {
      throw new Error('Error al obtener el carrito: ' + error.message);
    }
  }

  async getOneCart() {
    try {
      const cart = await CartModel.findOne({}).sort({ createdAt: 1 });
      return cart;
    } catch (error) {
      throw new Error("Error al obtener el carrito: " + error.message);
    }
  }

  async updateCartQuantity(cid, existingProduct) {
    try {
      const cart = await CartModel.findByIdAndUpdate(
        cid,
        { $set: { "productos.$[element].cantidad": existingProduct.cantidad } },
        { arrayFilters: [{ "element._id": existingProduct._id }], new: true }
      );
  
      return cart;
    } catch (error) {
      throw new Error("Error al actualizar el carrito: " + error.message);
    }
  }
  
  



  
  async deleteCart(cartId) {
    try {
      await CartModel.findByIdAndDelete(cartId);
      return true;
    } catch (error) {
      throw new Error("Error al eliminar el carrito: " + error.message);
    }
  }

  async deleteCartItem(cartId, productId) {
    try {
        const cart = await CartModel.findById(cartId);
        console.log('Cart before deletion:', cart);

        // Filtrar los productos y mantener solo aquellos que no coincidan con el productId
        console.log('Product ID to remove:', productId);
        const index = cart.productos.findIndex(p => p._id.toString() === productId);
        
        if (index !== -1) {
            cart.productos.splice(index, 1); // Elimina el producto del array de productos en la posición index
            await cart.save(); // Guarda los cambios en el carrito

            return true;
    } }catch (error) {
        throw new Error("Error al eliminar el producto del carrito: " + error.message);
    }
}




async decreaseOneQuantity(cartId, pid){
  try {
      const cart = await CartModel.findByIdAndUpdate(
          cartId,
          { $inc: { "productos.$[element].cantidad": -1 } }, // Resta 1 a la cantidad del producto
          { arrayFilters: [{ "element._id": pid }], new: true }
      );

      // Verificar si la cantidad del producto es menor o igual a 0 y eliminarlo del carrito si es así
      const productIndex = cart.productos.findIndex(product => product._id == pid);
      console.log(productIndex)
      if (productIndex !== -1 && cart.productos[productIndex].cantidad <= 0) {
          // Si la cantidad es menor o igual a 0, eliminar el producto del carrito
          await this.deleteCartItem(cartId, cart.productos[productIndex].producto); // Utiliza el ID del producto

      }

      return cart;
  } catch (error) {
      throw new Error("Error al restar una unidad del producto en el carrito: " + error.message);
  }
}

async increaseOneQuantity(cartId, pid) {
  try {
      const cart = await CartModel.findByIdAndUpdate(
          cartId,
          { $inc: { "productos.$[element].cantidad": 1 } }, // Aumenta en 1 la cantidad del producto
          { arrayFilters: [{ "element._id": pid }], new: true }
      );

      return cart;
  } catch (error) {
      throw new Error("Error al aumentar una unidad del producto en el carrito: " + error.message);
  }
}




async updatedCartTotal(cid){
  try {
    const cart = await CartModel.findById(cid);

    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    let total = 0;

    // Iterar sobre los productos y sumar las cantidades
    for (const producto of cart.productos) {
      total += producto.cantidad;
    }

    // Actualizar el carrito con el total calculado
    const updatedCart = await CartModel.findByIdAndUpdate(
      cid,
      { $set: { total: total } },
      { new: true }
    );
    
    return updatedCart;
  } catch (error) {
    throw new Error("Error al actualizar el total del carrito: " + error.message);
  }
};




}

const cartService = new CartService();

export default cartService;
