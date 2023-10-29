import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import productManager from "./classes/productManager.js";

// Routes
import productRouter from "./routes/productRouter.js";
import cartRouter from "./routes/cartRouter.js";
import viewsRouter from "./routes/viewsRouter.js";

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));

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

server.listen(port, () => {
	console.log(`😎 Listening on port ${port} 😎`);
});
