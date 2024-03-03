import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import mongoose from "mongoose";
import MongoStore from 'connect-mongo'
import session from "express-session";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import cors from "cors"

// Routes
import productRouter from "./routes/api_productRouter.js";
import apicartRouter from "./routes/api_cartRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
import sessionRouter from "./routes/session.router.js";
import usersRouter from "./routes/api_usersRouter.js";
import cartRouter from "./routes/cartRouter.js"
import paymentsRouter from './routes/paymentsRouter.js';

import * as productConstroller from "./dao/controllers/productController.js"
import * as cartController from "./dao/controllers/cartController.js"
import * as chatController from "./dao/controllers/chatController.js"

//documentacion
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express"

//logger
import {addLogger, logger} from './logger.js' // Importar el logger y la función addLogger
// Obtener la configuración del entorno
import config from "./config/config.js";
import dotenv from 'dotenv';
dotenv.config();



//inicializacion de servidor // variables mongo

const mongoUrl = config.mongoUrl;
const mongoDBName =config.mongoDBName;
const app = express();
const port = config.port || 8080;

//aplicar el logger
app.use(addLogger)

// aplicar cors para no tener problemas de web

app.use(cors());
//inicializacion de documentacion 
const swaggerOptions = {
  definition:{
    openapi:"3.0.1",
    info:{
      title:"Documentacion del ecommerse",
      description:'Este proyecto es un trabajo integrador del curso de backend 2023-2024'
    }
  },
  apis:[`${__dirname}/docs/**/*.yaml`]
}
const specs = swaggerJSDoc(swaggerOptions)
app.use('/apidocs',swaggerUiExpress.serve,swaggerUiExpress.setup(specs))

// Configuracion Sessions
app.use(session({
  store: MongoStore.create({
      mongoUrl: mongoUrl,
      dbName: mongoDBName,
      mongoOptions:{
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 100
  }),
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

//inicializar passport para iniciar sesion con github
//y aplicarle el midle a app
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

//config de json para los post 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//definicion de handlebars - motor de plantillas - 
app.use(express.static(__dirname + "/public"));
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// Configurar el nivel de registro del logger según el entorno
const logLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';
logger.transports[0].level = logLevel; // Setear el nivel de registro para la consola


//////////////////////
//   Enrutamientos  // 
//////////////////////
app.use("/", viewsRouter);
app.get('/health', (req, res) => res.send('OK'))
app.use("/api/cart", apicartRouter);
app.use("/api/products", productRouter);
app.use('/api/session', sessionRouter)
app.use('/api/users', usersRouter)
app.use('/create_preference',paymentsRouter)
app.use('/cart',cartRouter)

const server = http.createServer(app);
const io = new SocketIOServer(server);

io.on("connection", (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);

  //-------------------------------//
  //----- funciones del socket ----//
  //-------------------------------//

    
  socket.on('addProduct', (producto) => {
    console.log('Se agrego el producto correctamente')
    console.log(producto)
    productConstroller.addProduct(producto)
  });

 // en /products boton de agregar al carrito

// Acción addtocart de products y productsDetails.hanlebars mediante products.js
socket.on('addToCart', async ({ productId, userId }) => {
  console.log("en el socket? : producto: " + productId, " Iduser: " + userId);
  try {
      // Obtener el carrito existente o crear uno nuevo
      const cart = await cartController.getOneCart();
      let cid = cart._id
      if (cart) {
          // Verificar si el producto ya está en el carrito
          const existingProduct = cart.productos && Array.isArray(cart.productos) && cart.productos.find((product) => product && product.producto && product.producto.toString() === productId);
          if (existingProduct) {
              // Si el producto ya existe, actualiza la cantidad en lugar de agregar un nuevo elemento
              existingProduct.cantidad += 1;
              // Utilizar la función updateCartItem para actualizar la cantidad del producto en el carrito
              await cartController.updateCartQuantity(cid, existingProduct);
              console.log('Producto en el carrito. Cantidad actualizada');
          } else {
              // Si el producto no existe en el carrito, llama a la función addToCart del CartManager
              await cartController.addToCart(cid, productId, { cantidad: 1 }, userId);
              console.log('Producto agregado al carrito. Carrito actualizado');
          }
      } else {
          // Lógica si el carrito no se encuentra
          console.error('Carrito no encontrado');
          socket.emit('addToCartError', { error: 'Carrito no encontrado' });
      }
  } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
      // Puedes emitir un evento de error si es necesario
      socket.emit('addToCartError', { error: 'Error al agregar producto al carrito' });
  }
});



  socket.on('addMessage', (messageData) => {
    console.log('mensaje enviado');
    chatController.addMessage(messageData);
});



  socket.on("disconnect", () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });

});

// ------------------------actualmente en desuso-----------------------
// // eliminacion de un producto de la bd (no del carrito)
// socket.on('deleteProduct', async(product_code) => {
//   //mongoose 
//   const mongoose_product = productManagerMongoose.getProductByCode(product_code)
//   productManagerMongoose.deleteProductById(mongoose_product.__id)
//   console.log('Se Elimino el producto correctamente')
//   // fs
//   // const fs_id = productManager.getProductByCode(product_code)
//   // productManager.deleteProduct(fs_id);

// });


/////////////////////////////
//   conectamos mongoose  ///
/////////////////////////////
mongoose.connect(mongoUrl,{dbName:mongoDBName})
    .then(() => {
        console.log('db conectada')
        server.listen(port,()=>{
            console.log('escuchando en 8080')
        })
    })

    .catch(error =>{
        console.error("error connecting to the DB")
    })

