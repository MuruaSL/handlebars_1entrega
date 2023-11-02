import express from "express";
import productManager from "../dao/managers/fs.productManager.js";
import MessageManagerMongoose from "../dao/managers/mongoose.chatManager.js";

const viewsRoutes = express.Router();

viewsRoutes.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("home", { products });
  } catch (error) {
    console.error("Error en la ruta principal:", error);
    res.status(500).send("Error interno del servidor: " + error.message);
  }
});

viewsRoutes.get("/realTimeProducts", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("realTimeProducts", { products });
  } catch (error) {
    console.error("Error en la realTimeProducts:", error);
    res.status(500).send("Error interno del servidor: " + error.message);
  }
});

viewsRoutes.get("/chat", async (req, res) => {
  try {
    const AllMessages = await MessageManagerMongoose.getMessages();
    res.render("chat",{AllMessages});
  } catch (error) {
    console.error("Error en la pagina Chat:", error);
    res.status(500).send("Error interno del servidor: " + error.message);
  }
});



export default viewsRoutes;