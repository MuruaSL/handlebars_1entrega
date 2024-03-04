import { json } from "express";
import cartService from "../services/cart.services.js";

// Crea un nuevo carrito
export const createCart = (req, res) => {
  try {
    const { products } = req.body;
    console.log(products); // Agrega esta línea para verificar los productos en la consola
    const newCart = cartManager.createCart(products);
    res.status(201).json(newCart);
  } catch (error) {
    req.logger.error("Error al crear el carrito")
    res.status(500).json({ error: "Error al crear el carrito" });
  }
};
// Controlador para obtener un carrito por su ID
export const getCartById = async (cid) => {
  try {
    const cart = await cartService.getCartById(cid);
    return cart;
  } catch (error) {
    // Manejar el error de alguna manera
    throw new Error("No se pudo obtener el carrito: " + error.message);
  }
};

// Controlador para obtener un carrito único
export const getOneCart = async () => {
  try {
    const cart = await cartService.getOneCart();
    return cart;
  } catch (error) {
    // Manejar el error de alguna manera
    throw new Error("No se pudo obtener el carrito: " + error.message);
  }
};


// Agrega un producto al carrito
export const addToCart = async (cid, pid, productData, userId) => {
  try {
    return await cartService.addToCart(cid, pid, productData, userId); // retornar resultado de cartService.addToCart
  } catch (error) {
    throw error; // Lanza el error nuevamente para que pueda ser manejado por el controlador
  }
};


/**
 * The function `updateCartQuantity` updates the quantity of an existing product in the cart and then
 * updates the total cart amount.
 * @param cid - The `cid` parameter in the `updateCartQuantity` function likely stands for the cart ID,
 * which is used to identify a specific cart in the system.
 * @param existingProduct - The `existingProduct` parameter likely refers to the product that is
 * already in the cart and needs to be updated with a new quantity. This parameter would contain
 * information such as the product ID, quantity, price, and any other relevant details needed to update
 * the cart with the new quantity for that specific product
 */
export const updateCartQuantity = async (cid,existingProduct) => {
  try {
    await cartService.updateCartQuantity(cid, existingProduct);
    await cartService.updatedCartTotal(cid)
  } catch (error) {
    console.log("error> "+ error.message);
  }
};

export const decreaseOneQuantityController = async (cartId, pid, req, res) => {
  try {
      // Llama a la función decreaseOneQuantity del servicio
      const updatedCart = await cartService.decreaseOneQuantity(cartId, pid);

      // Envía una respuesta exitosa
      res.json({ status: 'success', message: 'Producto en el carrito actualizado correctamente', updatedCart });
  } catch (error) {
      // Maneja cualquier error que ocurra durante el proceso
      console.error("Error al restar una unidad del producto en el carrito:", error);
      res.status(500).json({ status: 'error', message: 'Error al restar una unidad del producto en el carrito' });
  }
  
};

export const increaseOneQuantityController = async (cartId, pid, req, res) => {
  try {
      // Llama a la función increaseOneQuantity del servicio
      const updatedCart = await cartService.increaseOneQuantity(cartId, pid);

      // Envía una respuesta exitosa
      res.json({ status: 'success', message: 'Producto en el carrito actualizado correctamente', updatedCart });
  } catch (error) {
      // Maneja cualquier error que ocurra durante el proceso
      console.error("Error al aumentar una unidad del producto en el carrito:", error);
      res.status(500).json({ status: 'error', message: 'Error al aumentar una unidad del producto en el carrito' });
  }
};


// Elimina un producto del carrito
export const deleteCartItem = async (cid, pid) => {
  try {
      // Llama al servicio para eliminar el producto del carrito
      const result = await cartService.deleteCartItem(cid, pid);
      return result; // Retorna el resultado de la eliminación
  } catch (error) {
      console.error('Error al eliminar el producto del carrito:', error);
      throw new Error('Error interno del servidor al eliminar el producto del carrito');
  }
};

