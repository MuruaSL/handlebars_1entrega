import productService from "../services/product.services.js";
import { logger } from "../../logger.js";

export const getAllProducts = async (req, res) => {
  try {
    const { page, limit, sort, query } = req.query;
    const hasFilterParams = page || limit || sort || query;

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
      req.logger.error("Los productos no se han obtenido correctamente.");
    }

    const processedProducts = Array.isArray(products)
      ? products.map(product => (product.toObject ? product.toObject() : product))
      : products.toObject
      ? products.toObject()
      : products;

    return processedProducts;
  } catch (error) {
    req.logger.error("Error al obtener los productos:", error);
    res.status(500).send("Error interno del servidor: " + error.message);
  }
};

export const createProduct = async (bodyProduct, sessionUserId) => {
  try {
    // Verifica si sessionUserId está definido
    if (!sessionUserId) {
      throw new Error('Usuario no autenticado');
    }

    // Asignar el ID del usuario como propietario del producto
    const owner = sessionUserId;
    const newProductData = bodyProduct
    newProductData.owner = owner

    // Crear el producto utilizando el servicio de productos
    const newProduct = await productService.create(newProductData);

    // Registrar la creación del nuevo producto
    logger.info('Nuevo producto creado:', newProduct);

    // Devolver el nuevo producto creado
    return newProduct;
  } catch (error) {
    // Manejar el error y lanzarlo nuevamente para que se maneje en la ruta
    throw error;
  }
};





export const getProductById = async (req, res) => {
  const productId = req.params.pid;
  try {
    const product = await productService.getProductById(productId);
    if (!product) {
      req.logger.error("Producto no encontrado.");
      return res.status(404).send("Producto no encontrado");
    }
    return res.json(product);
  } catch (error) {
    req.logger.error("Error al obtener el producto:", error.message);
    return res.status(500).send("Error interno del servidor: " + error.message);
  }
};

export const updateProduct = async (req, res) => {
  const productId = req.params.pid;
  const updatedData = req.body;
  try {
    const updatedProduct = await productService.update(productId, updatedData);
    res.json(updatedProduct);
    req.logger.info("Producto modificado correctamente:", updatedProduct);
  } catch (error) {
    req.logger.error("Hubo un problema al modificar el producto:", error.message);
    res.status(500).send("Error interno del servidor: " + error.message);
  }
};

export const deleteProduct = async (req, res) => {
  const productId = req.params.pid;
  try {
    const product = await productService.getProductById(productId);
    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }

    // Verificar si el usuario es propietario del producto o es un administrador
    if (product.owner.toString() === req.user._id.toString() || req.user.role === "admin") {
      await productService.delete(productId);
      req.logger.info(`Se eliminó el producto con ID: ${productId}`);
      return res.status(204).end();
    } else {
      return res.status(403).send("No tiene permisos para eliminar este producto");
    }
  } catch (error) {
    req.logger.error("Hubo un problema al eliminar el producto:", error.message);
    res.status(500).send("Error interno del servidor: " + error.message);
  }
};








// import productService from "../services/product.services.js";

// //Funcion de recuperacion de los productos desde la base de datos, en caso de que haya req.query, se usa ademas la funcion de filtrado del services
// //para que el listado obtenido ademas sea segun lo especificado por http
// export const getAllProducts = async (req, res) => {
//   try {
//     const { page, limit, sort, query } = req.query;
//     // console.log("Params:", { page, limit, sort, query });
//     const hasFilterParams = page || limit || sort || query;
//     // console.log("Has filter params:", hasFilterParams);

//     let products;

//     if (hasFilterParams) {
//       products = await productService.filteredGetProducts({
//         page,
//         limit,
//         sort,
//         query,
//       });
//     } else {
//       products = await productService.getAll();
//     }

//     if (!products) {
//       req.logger.error("Los productos no se han obtenido correctamente.");
//     }

//     // Si los productos son documentos de Mongoose, los convertimos a objetos
//     const processedProducts = Array.isArray(products)
//       ? products.map(product => (product.toObject ? product.toObject() : product))
//       : products.toObject
//       ? products.toObject()
//       : products;

//     return processedProducts;
//   } catch (error) {
//     req.logger.error("Error al obtener los productos:", error);
//     // Enviar una respuesta de error
//     res.status(500).send("Error interno del servidor: " + error.message);
//   }
// };




// export const createProduct = async (req, res) => {
//   const productData = req.body;
//   try {
//     const newProduct = await productService.create(productData);
//     res.status(201).json(newProduct);
//     req.logger.info(json("nuevo producto: "+ newProduct))
//   } catch (error) {
//     req.logger.error(error.message);
//   }
// };

// export const getProductById = async (pid) => {
  
//   try {
//     return await productService.getProductById(pid);
    
//   } catch (error) {
//     req.logger.error("producto no encontrado")
//   }
// };

// export const updateProduct = async (req, res) => {
//   const productId = parseInt(req.params.pid);
//   const updatedData = req.body;
//   try {
//     const updatedProduct = await productService.update(productId, updatedData);
//     res.json(updatedProduct);
//     req.logger.info('producto modificado correctamente: '+ json(updatedProduct))
//   } catch (error) {
//     req.logger.error("Hubo un problema al modificar el producto> "+error.message)
//   }
// };

// export const deleteProduct = async (req, res) => {
//   const productId = parseInt(req.params.pid);
//   try {
//     await productService.delete(productId);
//     req.logger.info(`Se eliminó el producto con ID: ${productId}`);
//   } catch (error) {
//     req.logger.error({ error: error.message });
//   }
// };
