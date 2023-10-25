import express from "express";
import __dirname from "../utils.js";
import ProductManager from "../logic/productManager.js";
const productManager = new ProductManager("../../json/productos.json");
const realTimeProductsRouter = (socketServer) => {
  const router = express.Router();

  // Define rutas y utiliza socketServer
  router.get("/", (req, res) => {
    const products = productManager.getProducts(); // Asegúrate de que productManager esté definido
    res.render("realTimeProducts", { products });
  });

  // Las actividades del socket se pueden definir aquí
  socketServer.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");
    // Realiza otras operaciones con el socket aquí
  });

  return router;
};

export default realTimeProductsRouter;
