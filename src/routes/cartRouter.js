import { Router } from "express";
import { getOneCart, getCartById, decreaseOneQuantityController,deleteCartItem, increaseOneQuantityController } from "../dao/controllers/cartController.js";
import { getProductById } from '../dao/controllers/productController.js';

const cartRouter = Router();

cartRouter.get("/", async (req, res) => {
    try {
        if (!req.session?.user) {
            return res.redirect('/login');
        }
        
        // Obtener el ID del carrito
        const oneCart = await getOneCart();
        const oneCartID = oneCart._id;

        // Obtener el carrito usando el ID obtenido anteriormente
        const cart = await getCartById(oneCartID);

        // Obtener los productos del carrito con los detalles completos
        const detailedProducts = [];
        for (const productInCart of cart.productos) {
            const productDetails = await getProductById(productInCart.producto);
            const subtotal = productDetails.price * productInCart.cantidad; // Calcular el subtotal
            
            // Asegurarse de que el objeto producto tenga las propiedades title y price
            const safeProductDetails = {
                title: productDetails.title || 'Producto sin título',
                price: productDetails.price ? productDetails.price.toFixed(2) : 'Precio no disponible'
            };
            
            detailedProducts.push({
                _id: productInCart._id,
                producto: safeProductDetails,
                cantidad: productInCart.cantidad,
                subtotal: subtotal.toFixed(2) // Redondear el subtotal a 2 decimales
            });
        }

        // Renderizar la vista del carrito con los productos detallados
        res.render('cart', { products: detailedProducts, cartId: oneCartID });
    } catch (error) {
        console.error("Error al procesar la solicitud:", error);
        // Manejar el error de alguna manera, por ejemplo, renderizando una página de error
        res.status(500).send("Error interno del servidor");
    }
});

// modificar en  -1 la cantidad de un prod en carrito 
cartRouter.put("/product/:pid/decrease/:cartId", async (req, res) => {
    try {
        const { cartId, pid } = req.params; // Extraer cid y pid de los parámetros de la URL
    
        // Llamar al controlador con cid y pid
        await decreaseOneQuantityController(cartId, pid,req,res);
    } catch (error) {
        console.error("Error al procesar la solicitud:", error);
        res.status(500).send("Error interno del servidor");
    }
});

// modificar en  +1 la cantidad de un prod en carrito 
cartRouter.put("/product/:pid/increase/:cartId", async (req, res) => {
    try {
        const { cartId, pid } = req.params; // Extraer cartId y pid de los parámetros de la URL
        
        // Llamar al controlador con cartId y pid para aumentar en 1 la cantidad del producto en el carrito
        await increaseOneQuantityController(cartId, pid, req, res);
    } catch (error) {
        console.error("Error al procesar la solicitud:", error);
        res.status(500).send("Error interno del servidor");
    }
});


cartRouter.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const productId = req.params.pid.toString(); // Convertir el ID del producto a cadena
        const cid = req.params.cid.toString()
        const result = await deleteCartItem(cid, productId); // Llama al controlador para eliminar el producto del carrito


        // Verifica el resultado y envía la respuesta correspondiente
        if (result) {
            res.json({ status: 'success', message: 'Producto eliminado del carrito correctamente' });
        } else {
            res.status(404).json({ status: 'error', message: 'Producto o carrito no encontrado' });
        }
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});


export default cartRouter;