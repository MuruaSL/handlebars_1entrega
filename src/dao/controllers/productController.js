import productService from "../services/product.services.js";

//Funcion de recuperacion de los productos desde la base de datos, en caso de que haya req.query, se usa ademas la funcion de filtrado del services
//para que el listado obtenido ademas sea segun lo especificado por http
export const getAllProducts = async (req, res) => {
  try {
    const { page, limit, sort, query } = req.query;
    // console.log("Params:", { page, limit, sort, query });
    const hasFilterParams = page || limit || sort || query;
    // console.log("Has filter params:", hasFilterParams);

    let products;

    if (hasFilterParams) {
      products = await productService.filteredGetProducts({
        page,
        limit,
        sort,
        query,
      });
    } else {
      products = await productService.getAll();
    }

    if (!products) {
      throw new Error("Los productos no se han obtenido correctamente.");
    }

    // Si los productos son documentos de Mongoose, los convertimos a objetos
    const processedProducts = Array.isArray(products)
      ? products.map(product => (product.toObject ? product.toObject() : product))
      : products.toObject
      ? products.toObject()
      : products;

    return processedProducts;
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    // Enviar una respuesta de error
    res.status(500).send("Error interno del servidor: " + error.message);
  }
};




export const createProduct = async (req, res) => {
  const productData = req.body;
  try {
    const newProduct = await productService.create(productData);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getProductById = async (pid) => {
  
  try {
    return await productService.getProductById(pid);
    
  } catch (error) {
    res.status(404).json({ error: "Producto no encontrado" });
  }
};

export const updateProduct = async (req, res) => {
  const productId = parseInt(req.params.pid);
  const updatedData = req.body;
  try {
    const updatedProduct = await productService.update(productId, updatedData);
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  const productId = parseInt(req.params.pid);
  try {
    const deletedMessage = await productService.delete(productId);
    res.json(`Se eliminó el producto con ID: ${productId}`);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
