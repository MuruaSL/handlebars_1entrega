import express from 'express';
import {
  createCart,
  getCartById,
  addToCart,
  updateCart,
  deleteCart,
  updateCartItem,
  deleteCartItem,
} from '../dao/managers/mongoose.cartManager.js';

const cartRouter = express.Router();

// Rutas para carts
cartRouter.post('/', async (req, res) => {
  try {
    const cartData = req.body; // Recibe los datos del carrito desde el cuerpo de la solicitud
    const createdCart = await createCart(cartData);
    res.status(201).json({ status: 'success', message: 'Carrito creado', cart: createdCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

cartRouter.get('/:cartId', async (req, res) => {
  try {
    const { cartId } = req.params;
    const cart = await getCartById(cartId);
    if (!cart) {
      res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    } else {
      res.json({ status: 'success', cart });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

cartRouter.put('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const updatedData = req.body; // Datos para actualizar el carrito
    const updatedCart = await updateCart(cid, updatedData);
    res.json({ status: 'success', message: 'Carrito actualizado correctamente', cart: updatedCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

cartRouter.delete('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const result = await deleteCart(cid);
    if (result) {
      res.json({ status: 'success', message: 'Carrito eliminado correctamente' });
    } else {
      res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

cartRouter.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedQuantity = req.body.cantidad; // Nueva cantidad de ejemplares del producto
    const updatedCart = await updateCartItem(cid, pid, updatedQuantity);
    res.json({ status: 'success', message: 'Producto en el carrito actualizado correctamente', cart: updatedCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

cartRouter.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const result = await deleteCartItem(cid, pid);
    if (result) {
      res.json({ status: 'success', message: 'Producto eliminado del carrito correctamente' });
    } else {
      res.status(404).json({ status: 'error', message: 'Producto o carrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

cartRouter.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const productData = req.body; // Datos del producto a agregar
    const updatedCart = await addToCart(cid, pid, productData);
    res.json({ status: 'success', message: 'Producto agregado al carrito correctamente', cart: updatedCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default cartRouter;
