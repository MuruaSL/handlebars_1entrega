import express from 'express';
import { getAllProducts, createProduct, getProductById,updateProduct,deleteProduct} from '../controllers/productController.js';

const productRouter = express.Router();

// Rutas para productos (http)
productRouter.get('/', getAllProducts);
productRouter.post('/', createProduct);
productRouter.get('/:pid', getProductById);
productRouter.put('/:pid', updateProduct);
productRouter.delete('/:pid', deleteProduct);



export default productRouter;
