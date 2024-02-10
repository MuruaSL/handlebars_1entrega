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
      req.logger.error("Error al obtener los productos:", error.message);
    }
  },
};

export default viewsController;
