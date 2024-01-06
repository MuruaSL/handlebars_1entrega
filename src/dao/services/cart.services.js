import CartModel from "../models/cart-schema.js";

class CartService {
async createCart() {
  try {
    const newCart = new CartModel(cartData);
    const savedCart = await newCart.save();
    return savedCart;
  } catch (error) {
    throw new Error("Error al crear el carrito: " + error.message);
  }
};

async addToCart() {
  try {
    const quantity = productData.cantidad;
    const cart = await CartModel.findById(cartId);

    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    if (!cart.productos || !Array.isArray(cart.productos)) {
      cart.productos = [];
    }

    const existingProduct = cart.productos.find((product) => product && product.producto && product.producto.toString() === productId);

    if (existingProduct) {
      existingProduct.cantidad += quantity;
    } else {
      const productData = {
        producto: productId,
        cantidad: quantity,
      };
      cart.productos.push(productData);
    }

    const updatedCart = await cart.save();
    return updatedCart;
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    throw new Error('Error al agregar producto al carrito: ' + error.message);
  }
};

async getCartById(cid) {
    try {
      return await CartModel.findById(cid).exec();
    } catch (error) {
      throw new Error('Error al obtener el carrito: ' + error.message);
    }
  }

async getOneCart() {
  try {
    const cart = await CartModel.findOne(filter);
    return cart;
  } catch (error) {
    throw new Error("Error al obtener el carrito: " + error.message);
  }
};

async updateCart(cartId, updatedData){
  try {
    const cart = await CartModel.findByIdAndUpdate(cartId, updatedData, { new: true });
    return cart;
  } catch (error) {
    throw new Error("Error al actualizar el carrito: " + error.message);
  }
};

async updateCartItem(cartId, productId, updatedQuantity){
  try {
    const cart = await CartModel.findById(cartId);
    const productToUpdate = cart.productos.find((p) => p.producto.toString() === productId);
    if (productToUpdate) {
      productToUpdate.cantidad = updatedQuantity;
      await cart.save();
      return cart;
    } else {
      throw new Error("Producto no encontrado en el carrito.");
    }
  } catch (error) {
    throw new Error("Error al actualizar el producto en el carrito: " + error.message);
  }
};

async deleteCart(cartId){
  try {
    await CartModel.findByIdAndDelete(cartId);
    return true;
  } catch (error) {
    throw new Error("Error al eliminar el carrito: " + error.message);
  }
};

async deleteCartItem(cartId, productId){
  try {
    const cart = await CartModel.findById(cartId);
    const initialLength = cart.productos.length;
    cart.productos = cart.productos.filter((p) => p.producto.toString() !== productId);
    if (cart.productos.length < initialLength) {
      await cart.save();
      return true;
    } else {
      throw new Error("Producto no encontrado en el carrito.");
    }
  } catch (error) {
    throw new Error("Error al eliminar el producto del carrito: " + error.message);
  }
};
}

const cartService = new CartService();

export default cartService;