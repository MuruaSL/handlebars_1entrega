import express from "express";
import productManager from "../dao/managers/fs.productManager.js";
import mongooseproductManager from "../dao/managers/mongoose.productManager.js";

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




export default viewsRoutes;