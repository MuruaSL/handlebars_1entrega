import express from 'express';
import __dirname from "./utils.js";
import handlebars from "express-handlebars"
import bodyParser from 'body-parser';
import productRouter from './routes/productRouter.js';
import cartRouter from './routes/cartRouter.js';
import indexRouter from './routes/indexRouter.js';
import viewsRouter from './routes/viewsRouter.js'
import realTimeProductsRouter from './routes/realTimeProductsRouter.js';
import path from 'path';
import { Server } from 'socket.io';


const app = express();
const puerto = 8080;
//configuracion de carpeta public
app.use(express.static(path.join(__dirname, 'public'))); //ESTA LINEA DEBE ESTAR ACA ARRIBA, SINO NUNCA ENCUENTRA LA CARPETA PUBLIC 

//nuevo 
const httpServer = app.listen(puerto,()=>{
    console.log("escuchando puerto 8080")
})

//inicializacion de server socket 

const socketServer = new Server(httpServer)

//configuracion de handlebars // plantilla
app.engine('handlebars', handlebars.engine())// declaro el motor
app.set('views', path.join(__dirname+'/routes/views')); // indico que la carpeta tiene las vistas
app.set('view engine', 'handlebars') //declaramos las vistas y con que motor

//declaracion de ruteos
app.use(bodyParser.json());
app.use('/api/products', productRouter);
app.use('/api/carts',cartRouter)
app.use('/',indexRouter)
app.use('/realtimeproducts',realTimeProductsRouter)

//actividades del socket

socketServer.on('connection',socket=>{
    console.log("nuevo cliente conectado")
})