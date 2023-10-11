import express from 'express';
import handlebars from "express-handlebars"
import bodyParser from 'body-parser';
import productRouter from './routes/productRouter.js';
import cartRouter from './routes/cartRouter.js';
import indexRouter from './routes/indexRouter.js';
import __dirname from "./utils.js";
import path from 'path';
import realTimeProductsRouter from './routes/realTimeProductsRouter.js';

const app = express();
const puerto = 8080;
//configuracion de handlebars 
app.engine('handlebars', handlebars.engine())// declaro el motor
app.set('views', path.join(__dirname+'/routes/views')); // indico que la carpeta tiene las vistas
app.set('view engine', 'handlebars') //declaramos las vistas y con que motor
app.use(express.static(path.join(__dirname, 'public')));

//declaracion de ruteos
app.use(bodyParser.json());
app.use('/api/products', productRouter);
app.use('/api/carts',cartRouter)
app.use('/',indexRouter)
app.use('/realtimeproducts',realTimeProductsRouter)

//inicializacion de server 
app.listen(puerto, () => {
    console.log(`Servidor corriendo en puerto: ${puerto}`);
});

