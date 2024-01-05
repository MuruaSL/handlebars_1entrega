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
import config from "./config/config.js";


// Routes
import productRouter from "./routes/api_productRouter.js";
import cartRouter from "./routes/api_cartRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
import sessionRouter from "./routes/session.router.js";
//Managers
import productManagerMongoose from "./dao/managers/mongoose.productManager.js";
import mongooseChatManager from "./dao/managers/mongoose.chatManager.js";
import CartManagerMongoose from "./dao/managers/mongoose.cartManager.js";


//inicializacion de servidor // variables mongo
const mongoUrl = 'mongodb+srv://leonardomurua:Dd40521547-4618@clusterleonardo.hg2jvxi.mongodb.net/?retryWrites=true&w=majority'
const mongoDBName = 'ecommerse'
const app = express();
const port = 8080;

// Configuracion Sessions
app.use(session({
  store: MongoStore.create({
      mongoUrl,
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



//////////////////////
//   Enrutamientos  // 
//////////////////////
app.use("/", viewsRouter);
app.get('/health', (req, res) => res.send('OK'))
app.use("/api/cart", cartRouter);
app.use("/api/products", productRouter);
app.use('/api/session', sessionRouter)

const server = http.createServer(app);
const io = new SocketIOServer(server);

io.on("connection", (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);

  socket.on('addProduct', (producto) => {
    console.log('Se agrego el producto correctamente')
    console.log(producto)
    productManagerMongoose.addProduct(producto)
    // productManager.addProduct(producto);
  });

  //accion addtocart de products y productsDetails.hanlebars mediante products.js
  socket.on('addToCart', async ({ productId }) => {
    try {
        // Obtener el carrito existente o crear uno nuevo
        const cart = await CartManagerMongoose.getOneCart({});
        let updatedCart;  // Definir la variable fuera de las condicionales

        if (cart) {
            // Verificar si el producto ya está en el carrito
            const existingProduct = cart.productos && Array.isArray(cart.productos) && cart.productos.find((product) => product && product.producto && product.producto.toString() === productId);

            if (existingProduct) {
                // Si el producto ya existe, actualiza la cantidad en lugar de agregar un nuevo elemento
                existingProduct.cantidad += 1;

                // Utiliza la función updateCartItem para actualizar la cantidad del producto en el carrito
                updatedCart = await CartManagerMongoose.updateCartItem(cart._id, productId, existingProduct.cantidad);
                console.log('Producto existente encontrado. Carrito actualizado:', updatedCart);
            } else {
                // Si el producto no existe en el carrito, llama a la función addToCart del CartManager
                updatedCart = await CartManagerMongoose.addToCart(cart._id, productId, { cantidad: 1 });
                console.log('Producto agregado al carrito. Carrito actualizado:', updatedCart);
            }

            // Emitir evento a todos los clientes actualizando el carrito
            io.emit('updateCart', { cart: updatedCart });

            // Emitir un mensaje de éxito
            socket.emit('addToCartSuccess', { message: 'Producto agregado al carrito correctamente' });
        } else {
            // Puedes manejar la lógica aquí si el carrito no se encuentra
            console.error('Carrito no encontrado');
            socket.emit('addToCartError', { error: 'Carrito no encontrado' });
        }
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        // Puedes emitir un evento de error si es necesario
        socket.emit('addToCartError', { error: 'Error al agregar producto al carrito' });
    }
});


  socket.on('deleteProduct', async(product_code) => {
    //mongoose 
    const mongoose_product = productManagerMongoose.getProductByCode(product_code)
    productManagerMongoose.deleteProductById(mongoose_product.__id)
    console.log('Se Elimino el producto correctamente')
    // fs
    // const fs_id = productManager.getProductByCode(product_code)
    // productManager.deleteProduct(fs_id);

  });

  socket.on('addMessage', (message) => {
    console.log('mensaje enviado')
    console.log(message)
    mongooseChatManager.addMessage(message)
    
  });

  socket.on("disconnect", () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });

});

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
