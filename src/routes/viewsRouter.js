import express from "express";
import MessageManagerMongoose from "../dao/managers/mongoose.chatManager.js";
import productManagerMongoose from "../dao/managers/mongoose.productManager.js";
import productsModel from "../dao/models/products-schema.js";
import CartModel from "../dao/models/cart-schema.js";
import passport from "passport";
import viewsController from "../dao/controllers/viewsController.js";
import * as productController from '../dao/controllers/productController.js'
import productService from "../dao/services/product.services.js";
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

//////////////////////////////////
//   rutas de login con github  //
//////////////////////////////////

viewsRoutes.get('/login-github',passport.authenticate('github',{scope:['user:email']}))

viewsRoutes.get('/githubcallback',passport.authenticate('github',{failureRedirect:'/'}),
async(req,res)=>{
    //clg para ver los datos obtenidos de github
    // console.log('Callback: ',req.user)
    req.session.user = req.user
    // clg para ver datos de la session iniciada
    // console.log(req.session)
    res.redirect('/')
})


viewsRoutes.get('/private', auth, (req, res)=>{
  res.json(req.session.user)
})
export default viewsRoutes;



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


// vista de productos particulares

viewsRoutes.get('/products/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await productService.getProductById(productId);

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

viewsRoutes.get("/products", async (req, res) => {
  try {
    const products = await productController.getAllProducts(req, res);

    if (!products || !Array.isArray(products)) {
      // Si products es undefined o no es un array, devuelve un error
      throw new Error("Los productos no se han obtenido correctamente.");
    }

    // const productData = products.map(product => product.toObject());
    res.render("products", {products});
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).send("Error interno del servidor: " + error.message);
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

