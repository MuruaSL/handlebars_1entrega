import express from 'express';
import { getAllProducts, createProduct, getProductById,updateProduct,deleteProduct} from '../dao/controllers/productController.js';
import { addLogger } from '../logger.js';



import { isAuthenticated } from '../dao/modules/authUserModule.js';
const productRouter = express.Router();
productRouter.use(addLogger);
// Rutas para productos (http)
productRouter.get('/', async (req, res) => {
    try {
        const products = await getAllProducts(req, res);
        res.json(products); // Renderiza el resultado de getAllProducts como JSON
    } catch (error) {
        req.logger.error({ error: 'Error interno del servidor al obtener productos' });
    }
});
productRouter.post('/', isAuthenticated, async (req, res) => {
    console.log(req.body);
    try {
        const newProduct = await createProduct(req.body, req.session.user._id);
        res.status(201).json(newProduct);
        } catch (error) {
            req.logger.error('Error al crear el producto:', error);
        if (error.message === 'Usuario no autenticado') {
            res.status(401).json({ message: 'Usuario no autenticado' })
            req.logger.error("Usuario no autenticado");
        } else {
            res.status(500).json({ message: 'Error interno del servidor' });
        }
        }
    });
  

    productRouter.get('/:pid', (req, res) => {
        try {
            // Obtiene el pid de los parámetros de la ruta
            const pid = req.params.pid;
    
            // Llama a la función getProductById con el pid obtenido
            const product = getProductById(pid);
    
            // Envia la respuesta con el producto obtenido
            res.send(product);
        } catch (error) {
            // Manejo de errores
            console.error('Error al obtener el producto:', error);
            res.status(500).send('Error al obtener el producto');
        }
    });
productRouter.put('/:pid', updateProduct);
productRouter.delete('/:pid', deleteProduct);


export default productRouter;
