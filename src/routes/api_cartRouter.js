import express from 'express';
import mongoose from 'mongoose';
import {
  createCart,
  getCartById,
  addToCart,
  updateCart,
  deleteCart,
  updateCartItem,
  deleteCartItem,
} from '../dao/managers/mongoose.cartManager.js';
import CartModel from '../dao/models/cart-schema.js';
import * as cartController from"../dao/controllers/cartController.js"
import { isAuthenticated } from '../dao/modules/authUserModule.js';
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

cartRouter.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;

    // Obtén el carrito sin instancias de modelo (usando lean)
    const cart = await CartModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(cid) } },
      {
        $lookup: {
          from: 'products', // Nombre de la colección de productos en la base de datos
          localField: 'productos.producto',
          foreignField: '_id',
          as: 'productos.producto',
        },
      },
      { $unwind: { path: '$productos.producto', preserveNullAndEmptyArrays: true } },
    ]);

    console.log("Cart result:", cart);

    // Verifica si 'productos' es un objeto con la propiedad 'producto' y si 'producto' es un array
    if (!cart || cart.length === 0 || !cart[0].productos) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado o formato incorrecto' });
    }

    // Obtén la lista de productos
    const productList = Array.isArray(cart[0].productos.producto)
      ? cart[0].productos.producto.filter((product) => product !== null) // Filtra productos nulos
      : [cart[0].productos.producto].filter((product) => product !== null);

    // Formatea la respuesta según tu estructura deseada
    const formattedCart = {
      status: 'success',
      cart: {
        _id: cart[0]._id,
        id: cart[0].id,
        productos: productList.map((item) => ({
          producto: {
            id: item._id,
            title: item.title,
            description: item.description,
            price: item.price,
            code: item.code,
            stock: item.stock,
            status: item.status,
            thumbnails: item.thumbnails,
          },
          cantidad: item.cantidad,
          _id: item._id,
        })),
        __v: cart[0].__v,
        // Otros campos según sea necesario
      },
    };

    res.json(formattedCart);
  } catch (error) {
    console.error("Error:", error);
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

/////////////////////////////////////////////////////
//          AGREGAR PRODUCTOS AL CARRITO 
/////////////////////////////////////////////////////

//// esta funcion agrega los productos a un carrito pasado por parametro  :cid 
cartRouter.post('/:cid/product/:pid',isAuthenticated, async (req, res) => {
  try {
    const { cid, pid } = req.params; // cid y pid obtenidos de la url
    const productData = req.body; // Datos del producto a agregar
    const userId = req.user._id; // el id del usuario que agrega al carrito
    console.log("aqui> " + userId)
    const updatedCart = await cartController.addToCart(cid, pid, productData,userId);
    res.json({ status: 'success', message: 'Producto agregado al carrito correctamente', cart: updatedCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

 //// pero esta version agrega el producto a cualquier carrito que encuentre 
cartRouter.post('/product/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const productData = req.body; // Datos del producto a agregar

    // Obtener el primer carrito existente
    const cart = await CartModel.findOne();

    if (cart) {
      // El carrito existe, agrega el producto
      const productToAdd = await ProductModel.findById(pid);
      
      if (productToAdd) {
        // Agrega el producto al carrito
        cart.products.push({ product: productToAdd._id, cantidad: 1 });
        await cart.save();

        return res.json({ status: 'success', message: 'Producto agregado al carrito correctamente', cart });
      }
    } else {
      // El carrito no existe, crea un nuevo carrito y agrega el producto
      const newCart = new CartModel();
      const productToAdd = await ProductModel.findById(pid);

      if (productToAdd) {
        // Agrega el producto al nuevo carrito
        newCart.products.push({ product: productToAdd._id, cantidad: 1 });
        await newCart.save();

        return res.json({ status: 'success', message: 'Producto agregado al nuevo carrito correctamente', cart: newCart });
      }
    }

    // Si llegamos aquí, algo salió mal
    res.status(404).json({ status: 'error', message: 'No se pudo agregar el producto al carrito' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});



export default cartRouter;
