import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import productManager from "./dao/managers/fs.productManager.js";
import mongoose from "mongoose";
// Routes
import productRouter from "./routes/api_productRouter.js";
import cartRouter from "./routes/api_cartRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
import productManagerMongoose from "./dao/managers/mongoose.productManager.js";



//inicializacion de servidor 
const app = express();
const port = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//definicion de handlebars - motor de plantillas - 
app.use(express.static(__dirname + "/public"));
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/", viewsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/products", productRouter);

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

  socket.on('deleteProduct', async(product_code) => {
    //mongoose 
    const mongoose_product = productManagerMongoose.getProductByCode(product_code)
    productManagerMongoose.deleteProductById(mongoose_product.__id)
    console.log('Se Elimino el producto correctamente')
    // fs
    // const fs_id = productManager.getProductByCode(product_code)
    // productManager.deleteProduct(fs_id);

  });

  socket.on("disconnect", () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });

});


//conectamos mongo
const mongoURL = 'mongodb+srv://leonardomurua:Dd40521547-4618@clusterleonardo.hg2jvxi.mongodb.net/?retryWrites=true&w=majority'
const mongoDBName = 'ecommerse'

mongoose.connect(mongoURL,{dbName:mongoDBName})
    .then(() => {
        console.log('db conectada')
        server.listen(port,()=>{
            console.log('escuchando en 8080')
        })
    })

    .catch(error =>{
        console.error("error connect DB")
    })
