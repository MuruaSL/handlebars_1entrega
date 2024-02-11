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
// Obtiene un carrito por su ID
export const getCartById = async (cid) => {
  try{
    return await cartService.getCartById(cid);
    }catch(error){
    req.logger.error("No se encontro el carrito")
    res.status(404).json({ error: "Carrito no encontrado"})
  }
};
export const getOneCart = async (req, res) => {
  try {
    const cart = await cartService.getOneCart();
    return cart;
  } catch (error) {
    req.logger.error("No se encontro el carrito")
    res.status(404).json({ error: "Carrito no encontrado" });
  }
};

// Agrega un producto al carrito
export const addToCart = async (cid, productId, cantidad) => {
  try {
    await cartService.addToCart(cid, productId, cantidad);
  } catch (error) {

    req.logger.error("error> " + error);
  }
};

export const updateCartQuantity = async (cid,existingProduct) => {
  try {
    await cartService.updateCartQuantity(cid, existingProduct);
    await cartService.updatedCartTotal(cid)
  } catch (error) {
    req.logger.error(error +  "Error al actualizar el carrito");
  }
};

