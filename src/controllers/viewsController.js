import fs from "fs";
import __dirname from "../utils.js";
const dataProducts = JSON.parse(fs.readFileSync('../data/products.json', "utf-8"));

const viewsController = {
  main: (req, res) => {
    res.render("home", {
      titulo: "Lista de Productos",
      products: dataProducts,
    });
  },
};

export default viewsController;
