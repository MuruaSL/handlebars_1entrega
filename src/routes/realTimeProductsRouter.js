import express from 'express';
import ProductManager from '../logic/productManager.js';
import { Server as SocketIOServer } from 'socket.io'; // Importa el módulo Socket.IO
const productManager = new ProductManager('json/productos.json');


const realTimeProductsRouter = express.Router();

realTimeProductsRouter.get('/', (req, res) => {
    const products = productManager.getProducts();
    res.render('realTimeProducts', { products });
});


// io.on('connection', (socket) => {
//     console.log('Un cliente se ha conectado');

//     // Emitir la lista de productos cuando un cliente se conecte
//     const products = productManager.getProducts();
//     socket.emit('productos-actualizados', products);
    
//     socket.on('disconnect', () => {
//         console.log('Un cliente se ha desconectado');
//     });
// });

// Ruta para obtener la vista con la lista de productos en tiempo real
export default realTimeProductsRouter;


