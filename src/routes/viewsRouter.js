import express from "express";
import fsproductManager from "../dao/managers/fs.productManager.js";
import MessageManagerMongoose from "../dao/managers/mongoose.chatManager.js";
import productManagerMongoose from "../dao/managers/mongoose.productManager.js";
import productsModel from "../dao/models/products-schema.js";
const viewsRoutes = express.Router();

viewsRoutes.get("/", async (req, res) => {
  try {
    //logica para cargar las cosas con FS
    // const products = await fsproductManager.getProducts();
    // res.render("home", { products });

    //logica para cargar las cosas con Mongoose
    let products = await productManagerMongoose.getProducts()
    products = products.map(product => ({ ...product.toObject() }));
    res.render("home", { products });
  } catch (error) {
    console.error("Error en la ruta principal:", error);
    res.status(500).send("Error interno del servidor: " + error.message);
  }
});

// viewsRoutes.get("/realTimeProducts", async (req, res) => {
//   try {
//     //logica para cargar las cosas con FS
//     // const products = await fsproductManager.getProducts();

//     //logica para cargar las cosas con Mongoose
//     let products = await productManagerMongoose.getProducts()
//     products = products.map(product => ({ ...product.toObject() }));
//     res.render("realTimeProducts", { products });
//   } catch (error) {
//     console.error("Error en la realTimeProducts:", error);
//     res.status(500).send("Error interno del servidor: " + error.message);
//   }
// });

viewsRoutes.get("/chat", async (req, res) => {
  try {
    const AllMessages = await MessageManagerMongoose.getMessages();
    res.render("chat",{AllMessages});
  } catch (error) {
    console.error("Error en la pagina Chat:", error);
    res.status(500).send("Error interno del servidor: " + error.message);
  }
});
viewsRoutes.get('/realtimeproducts', async (req, res) => {
  const page = parseInt(req.query.page ?? 1);
  const limit = parseInt(req.query.limit ?? 10);
  const sort = req.query.sort ?? 'asc';
  const queryField = req.query.query ?? 'title';

  const sortOptions = {};
  if (queryField === 'title' || queryField === 'description' || queryField === 'price' || queryField === 'code' || queryField === 'stock' || queryField === 'status') {
    if (sort === 'asc') {
      sortOptions[queryField] = 1;
    } else if (sort === 'desc') {
      sortOptions[queryField] = -1;
    }
  }

  const filter = {};
  if (queryField === 'title' || queryField === 'description' || queryField === 'price' || queryField === 'code' || queryField === 'stock' || queryField === 'status') {
    // Aquí puedes aplicar un filtro si es necesario
    // Ejemplo: filter[queryField] = { $regex: 'valor_a_buscar', $options: 'i' };
  }

  const result = await productsModel.paginate(filter, {
    page,
    limit,
    lean: true,
    sort: sortOptions,
  });

  // Crea el objeto de respuesta siguiendo el formato que mencionaste
  const response = {
    status: 'success', // O 'error' en caso de error
    payload: result.docs,
    totalPages: result.totalPages,
    prevPage: result.prevPage,
    nextPage: result.nextPage,
    page: result.page,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevLink: result.hasPrevPage ? `/realtimeproducts?page=${result.prevPage}&limit=${limit}&sort=${sort}&query=${queryField}` : null,
    nextLink: result.hasNextPage ? `/realtimeproducts?page=${result.nextPage}&limit=${limit}&sort=${sort}&query=${queryField}` : null,
  };

  res.json(response);
});



export default viewsRoutes;