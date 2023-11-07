import CartModel from '../models/cart-schema.js';

// Crear un nuevo carrito
export const createCart = async (cartData) => {
  try {
    const newCart = new CartModel(cartData);
    const savedCart = await newCart.save();
    return savedCart;
  } catch (error) {
    throw new Error("Error al crear el carrito: " + error.message);
  }
};

export const addToCart = async (cartId, productId, productData) => {
  try {
    const quantity = productData.cantidad
    // Encuentra el carrito por su ID
    const cart = await CartModel.findById(cartId);

    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    // Verificar si el producto ya existe en el carrito
    const existingProduct = cart.productos.find((product) => product.producto.toString() === productId);

    if (existingProduct) {
      // Si el producto ya existe, actualiza la cantidad en lugar de agregar un nuevo elemento
      existingProduct.cantidad += quantity;
    } else {
      // Si el producto no existe en el carrito, crea un nuevo objeto con el ID del producto a agregar y la cantidad.
      const productData = {
        producto: productId,
        cantidad: quantity,
      };

      // Agrega el producto al carrito
      cart.productos.push(productData);
    }

    // Guarda el carrito actualizado en la base de datos
    const updatedCart = await cart.save();

    return updatedCart;
  } catch (error) {
    throw new Error('Error al agregar producto al carrito: ' + error.message);
  }
};


// Obtener un carrito por ID
export const getCartById = async (cartId) => {
  try {
    const cart = await CartModel.findById(cartId);
    return cart;
  } catch (error) {
    throw new Error("Error al obtener el carrito: " + error.message);
  }
};

// Actualizar todo el carrito
export const updateCart = async (cartId, updatedData) => {
  try {
    const cart = await CartModel.findByIdAndUpdate(cartId, updatedData, { new: true });
    return cart;
  } catch (error) {
    throw new Error("Error al actualizar el carrito: " + error.message);
  }
};

// Eliminar todos los productos del carrito
export const deleteCart = async (cartId) => {
  try {
    await CartModel.findByIdAndDelete(cartId);
    return true;
  } catch (error) {
    throw new Error("Error al eliminar el carrito: " + error.message);
  }
};

// Actualizar la cantidad de ejemplares de un producto en el carrito
export const updateCartItem = async (cartId, productId, updatedQuantity) => {
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

// Eliminar un producto específico del carrito
export const deleteCartItem = async (cartId, productId) => {
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
