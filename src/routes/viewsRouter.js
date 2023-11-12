import express from "express";
import fsproductManager from "../dao/managers/fs.productManager.js";
import MessageManagerMongoose from "../dao/managers/mongoose.chatManager.js";
import productManagerMongoose from "../dao/managers/mongoose.productManager.js";
import productsModel from "../dao/models/products-schema.js";
import CartModel from "../dao/models/cart-schema.js";
const viewsRoutes = express.Router();


//////////////////////////////////////////////////////////////////
//                      render en /
/////////////////////////////////////////////////////////////////

////////////////////////////
//    router de sessions  //
////////////////////////////

viewsRoutes.get("/", async (req, res) => {
  if (!req.session?.user) {
    return res.redirect('/login')
  }
  return res.render('home',{})

})

viewsRoutes.get('/login', (req, res) => {
  if(req.session?.user) {
      return res.redirect('/profile')
  }
  res.render('login', {})
})

viewsRoutes.get('/signup', (req, res) => {
  if(req.session?.user) {
      return res.redirect('/profile')
  }

  res.render('signup', {})
})

viewsRoutes.get('/profile', auth, (req, res) => {
  const user = req.session.user

  res.render('profile', user)
})

// middleware para autenticar si hay 
// una session y poder ir a /profile
// si no hay una session activa redirect al / que nos llevara al login
function auth(req, res, next) {
  if(req.session?.user) return next()
  res.redirect('/')
}

////////opcion donde renderiza paginado los productos
//   try {
//     const page = parseInt(req.query.page ?? 1);
//     const limit = parseInt(req.query.limit ?? 10);
//     const sort = req.query.sort ?? 'asc';
//     const queryField = req.query.query ?? 'title';

//     //logica para cargar las cosas con Mongoose
//     let products = await productManagerMongoose.filteredGetProducts({
//       page,
//       limit,
//       sort,
//       queryField
//     });

//     // Renderiza la vista "home" con los productos y parámetros de consulta
//     res.render("home", {
//       products: products.docs,  // Usa products.docs en lugar de products
//       page,
//       limit,
//       sort,
//       queryField,
//       totalPages: products.totalPages,
//       hasPrevPage: products.hasPrevPage,
//       hasNextPage: products.hasNextPage,
//       prevLink: products.prevPage ? `/?page=${products.prevPage}&limit=${limit}&sort=${sort}&query=${queryField}` : null,
//       nextLink: products.nextPage ? `/?page=${products.nextPage}&limit=${limit}&sort=${sort}&query=${queryField}` : null,
//     });
//   } catch (error) {
//     console.error("Error en la ruta principal:", error);
//     res.status(500).send("Error interno del servidor: " + error.message);
//   }
// });



//opcion de / donde solo cargan los productos 
// viewsRoutes.get("/", async (req, res) => {
//   try {
//     //logica para cargar las cosas con FS
//     // const products = await fsproductManager.getProducts();
//     // res.render("home", { products });

//     //logica para cargar las cosas con Mongoose
//     let products = await productManagerMongoose.getProducts()
//     products = products.map(product => ({ ...product.toObject() }));
//     res.render("home", { products });
//   } catch (error) {
//     console.error("Error en la ruta principal:", error);
//     res.status(500).send("Error interno del servidor: " + error.message);
//   }
// });

//////////////////////////////////////////////////////////////////
//                      render de chat 
/////////////////////////////////////////////////////////////////

viewsRoutes.get("/chat", async (req, res) => {
  try {
    const AllMessages = await MessageManagerMongoose.getMessages();
    res.render("chat",{AllMessages});
  } catch (error) {
    console.error("Error en la pagina Chat:", error);
    res.status(500).send("Error interno del servidor: " + error.message);
  }
});




//Funcionalidad de traer productos con fileSystem
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


//////////////////////////////////////////////////////////////////
//                      render en /realtimeproducts 
/////////////////////////////////////////////////////////////////
viewsRoutes.get('/realtimeproducts', async (req, res) => {
  try {
    const page = parseInt(req.query.page ?? 1);
    const limit = parseInt(req.query.limit ?? 10);
    const sort = req.query.sort ?? 'asc';
    const queryField = req.query.query ?? 'title';

    // Utiliza la función filteredGetProducts para obtener los productos
    const result = await productManagerMongoose.filteredGetProducts({ page, limit, sort, queryField });

    // Crea el objeto de respuesta siguiendo el formato que mencionaste
    const response = {
      status: 'success', // O 'error' en caso de error
      payload: result,
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
  } catch (error) {
    console.error("Error en la ruta /realtimeproducts:", error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

//////////////////////////////////////////////////////////////////
//                      render en /products 
/////////////////////////////////////////////////////////////////

viewsRoutes.get('/products', async (req, res) => {
  try {
    let products = await productManagerMongoose.getProducts();
    let user = req.session.user 
    // Renderiza una vista con la lista de productos y opciones para ver detalles o agregar al carrito
    products = products.map(product => ({ ...product.toObject() }));
    res.render('products', { products, user });
  } catch (error) {
    console.error('Error al obtener la lista de productos:', error);
    res.status(500).send('Error interno del servidor: ' + error.message);
  }
});

// vista de productos particulares

viewsRoutes.get('/products/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await productManagerMongoose.getProductById((productId.toString()));

    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }

    const productData = { ...product.toObject() };
    res.render('productDetail', { product: productData });
  } catch (error) {
    console.error('Error al obtener detalles del producto:', error);
    res.status(500).send('Error interno del servidor: ' + error.message);
  }
});


//////////////////////////////////////////////////////////////////
//                      render en /carts 
/////////////////////////////////////////////////////////////////
// Ruta para mostrar un carrito específico por su ID
viewsRoutes.get('/carts/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    let cart = await CartModel.findById(cid);

    if (!cart) {
      return res.status(404).send('Carrito no encontrado');
    }

    // Renderiza una vista con los productos que pertenecen al carrito
    const products = cart.productos.map(product => ({ ...product.toObject() }));
     // Crear un arreglo para almacenar los detalles completos de los productos
    const productDetails = [];

    // Recorrer los productos en el carrito y buscar sus detalles en la base de datos
    for (const product of products) {
      const productDetail = await productsModel.findById(product.producto);
      if (productDetail) {
        // Agregar los detalles del producto al arreglo
        productDetails.push({ ...productDetail.toObject(), cantidad: product.cantidad });
      }
    }
    res.render('cart', { products:productDetails });

  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    res.status(500).send('Error interno del servidor: ' + error.message);
  }
});




export default viewsRoutes;