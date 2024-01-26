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
    res.status(500).json({ error: "Error al crear el carrito" });
  }
};
// Obtiene un carrito por su ID
export const getCartById = async (cid) => {
  try{
    return await cartService.getCartById(cid);
    }catch(error){
    res.status(404).json({ error: "Carrito no encontrado"})
  }
};
export const getOneCart = async (req, res) => {
  try {
    const cart = await cartService.getOneCart();
    return cart;
  } catch (error) {
    res.status(404).json({ error: "Carrito no encontrado" });
  }
};

// Agrega un producto al carrito
export const addToCart = async (cid, productId,cantidad) => {
  try {
    cartService.addToCart(cid, productId, cantidad);
  } catch (error) {
    console.log("error> "+ error)
  }
};

export const updateCartQuantity = async (cid,existingProduct) => {
  try {
    await cartService.updateCartQuantity(cid, existingProduct);
    await cartService.updatedCartTotal(cid)
  } catch (error) {
    console.log(error +  "Error al actualizar el carrito");
  }
};

