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
export {io}
io.on("connection", (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);

  socket.on('addProduct', (producto) => {
    console.log(producto)
    productManager.addProduct(producto);
    productManagerMongoose.addProduct(producto)
  });

  socket.on('deleteProduct', (product_code) => {
    console.log(product_code)
    const product_id = productManager.getProductByCode(product_code)
    productManager.deleteProduct(product_id);
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
        app.listen(port,()=>{
            console.log('escuchando en 8080')
        })
    })

    .catch(error =>{
        console.error("error connect DB")
    })
