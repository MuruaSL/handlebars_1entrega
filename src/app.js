import express from 'express';
import path from 'path';
import handlebars from 'express-handlebars'; // Asegúrate de importar 'express-handlebars'
import bodyParser from 'body-parser';
import productRouter from './routes/productRouter.js';
import cartRouter from './routes/cartRouter.js';
import indexRouter from './routes/indexRouter.js';
import realTimeProductsRouter from './routes/realTimeProductsRouter.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import __dirname from './utils.js';

const app = express();
const puerto = 8080;

// Configuración de carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Crear el servidor HTTP antes de crear la instancia de socketServer
const httpServer = createServer(app);
const socketServer = new Server(httpServer);

// Exportar socketServer para que sea accesible desde otros módulos
export { socketServer };

// Configuración de handlebars / plantilla
app.engine('handlebars', handlebars.engine()); // Declaro el motor
app.set('views', path.join(__dirname, '/routes/views')); // Indico que la carpeta tiene las vistas
app.set('view engine', 'handlebars'); // Declaración de las vistas y el motor

// Declaración de ruteos
app.use(bodyParser.json());
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/', indexRouter);
app.use('/realtimeproducts', realTimeProductsRouter(socketServer));

// Iniciar el servidor
const server = httpServer.listen(puerto, () => {
    console.log(`Escuchando en el puerto ${puerto}`);
});
