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


export const updateCartQuantity = async (cid,existingProduct) => {
  try {
    await cartService.updateCartQuantity(cid, existingProduct);
    await cartService.updatedCartTotal(cid)
  } catch (error) {
    console.log("error> "+ error.message);
  }
};

