import productService from "../services/product.services.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAll();
    const { limit } = req?.query || products.length; 
    if (limit) {
      const limitedProducts = products.slice(0, parseInt(limit));
      if (res) {
        res.json(limitedProducts);
      } else {
        console.error("No se puede enviar la respuesta porque res no está definido.");
      }
    } else {
      if (res) {
        res.json(products);
      } else {
        console.error("No se puede enviar la respuesta porque res no está definido.");
      }
    }
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    if (res) {
      res.status(500).json({ error: "Error al obtener los productos", message: error.message });
    } else {
      console.error("No se puede enviar la respuesta de error porque res no está definido.");
    }
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

export const getProductById = async (req, res) => {
  const productId = parseInt(req.params.pid);
  try {
    const product = await productService.getProductById(productId);
    res.json(product);
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
