import express from "express";
import ProductManager from '../logic/productManager.js';
const productManager = new ProductManager('json/productos.json');
const indexRouter = express.Router();
indexRouter.get('/', (req, res) => {
    // Llama a la función getAllProducts para obtener todos los productos
    const products = productManager.getProducts();

    // Renderiza la vista 'home' y pasa los productos como datos
    res.render('home', { 
        products,
        style: 'home.css'});
});

export default indexRouter;
