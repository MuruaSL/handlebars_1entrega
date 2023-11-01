import express from 'express';
import { createCart ,getCartById,addToCart} from '../controllers/cartController.js';

const cartRouter = express.Router();

// Rutas para productos
cartRouter.post('/', createCart);
cartRouter.get('/:cartId', getCartById);
cartRouter.post('/:cid/product/:pid', addToCart)
export default cartRouter;
