import express from 'express';
import ProductManager from '../logic/productManager.js';
import http from 'http'; // Importa el módulo HTTP
import { Server as SocketIOServer } from 'socket.io'; // Importa el módulo Socket.IO
const productManager = new ProductManager('json/productos.json');


const realTimeProductsRouter = express.Router();

// Configura el servidor HTTP y Socket.IO en el mismo lugar
const server = http.createServer(realTimeProductsRouter);

// Mantén una referencia a la instancia de Socket.IO (puede ser compartida en tu aplicación)
let io;

// Configura un manejador para eventos de conexión con Socket.IO
io = new SocketIOServer(server);

io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');

    // Emitir la lista de productos cuando un cliente se conecte
    const products = productManager.getProducts();
    socket.emit('productos-actualizados', products);
    
    socket.on('disconnect', () => {
        console.log('Un cliente se ha desconectado');
    });
});

// Ruta para obtener la vista con la lista de productos en tiempo real
realTimeProductsRouter.get('/', (req, res) => {
    const products = productManager.getProducts();
    res.render('realTimeProducts', { products });
});

export default realTimeProductsRouter;



// const app = express();
// const httpServer = http.createServer(app);
// const io = new Server(httpServer);

// app.use(bodyParser.json());
// app.use(express.urlencoded({ extend: true }));
// app.use(express.static('public'));

// app.engine('handlebars', handlerbars.engine());
// app.set('views', __dirname + '/views');
// app.set('view engine', 'handlebars');

// app.use("/api/products", productRouter);
// app.use("/api/carts", cartRouter);

// app.use("/", viewsRouter);
// app.use("/realTimeProducts", viewsRouter)

// io.on('connection', (socket) => {
//     console.log(`Cliente conectado: ${socket.id}`);
//     socket.emit('products', products);
//     socket.on('disconnect', () => {
//         console.log(`Cliente desconectado: ${socket.id}`);
//     });
// });

// httpServer.listen(port, () => {
//     console.log(`API and Socket.IO is listening on port ${port}`);
// });