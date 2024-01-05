import * as productsController from "../controllers/productController.js";

const viewsController = {
  renderProducts: async (req, res) => {
    try {
      const products = await productsController.getAllProducts();
      res.render("products", {
        title: "Lista de Productos",
        products: JSON.stringify(products),
      });
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      res.status(500).send("Error interno del servidor: " + error.message);
    }
  },
};

export default viewsController;
