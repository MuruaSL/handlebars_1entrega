import { Router } from "express";
import { getOneCart } from "../dao/controllers/cartController.js";
import { getCartById } from "../dao/controllers/cartController.js";
import { getProductById } from '../dao/controllers/productController.js';

const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
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
        res.render('cart', { products: detailedProducts });
    } catch (error) {
        console.error("Error al procesar la solicitud:", error);
        // Manejar el error de alguna manera, por ejemplo, renderizando una página de error
        res.status(500).send("Error interno del servidor");
    }
});

export default productsRouter;
