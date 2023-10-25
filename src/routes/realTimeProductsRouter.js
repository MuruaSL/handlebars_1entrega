import express from "express";
import __dirname from "../utils.js";
import ProductManager from "../logic/productManager.js";
const productManager = new ProductManager("json/productos.json");
const products = productManager.getProducts();

const realTimeProductsRouter = (socketServer) => {
  const router = express.Router();
  // Define rutas y utiliza socketServer
  router.get("/", (req, res) => { // Asegúrate de que productManager esté definido
    res.render("realTimeProducts", { products });
  });

  // Las actividades del socket se pueden definir aquí
  
  socketServer.on("connection", (socket) => {
    console.log('socketID: '+ socket.id)
    console.log("Nuevo cliente conectado");
    // console.log(products)
    socket.emit('products',products)
    // Realiza otras operaciones con el socket aquí
  });

  return router;
};

export default realTimeProductsRouter;
