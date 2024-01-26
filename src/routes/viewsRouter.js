import express from "express";
import passport from "passport";
import * as productController from '../dao/controllers/productController.js'
import * as cartController from "../dao/controllers/cartController.js";
import * as chatController from "../dao/controllers/chatController.js"

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
    const AllMessages = await chatController.getMessages();
    res.render("chat", { AllMessages });
  } catch (error) {
    console.error("Error en la página Chat:", error);
    res.status(500).send("Error interno del servidor: " + error.message);
  }
});




//////////////////////////////////////////////////////////////////
//                      render en /realtimeproducts 
/////////////////////////////////////////////////////////////////
// viewsRoutes.get('/realtimeproducts', async (req, res) => {
//   try {
//     const { page, limit, sort, query } = req.query;

//     // Llama directamente al controlador para obtener los productos
//     const products = await productController.getAllProducts(req, res);
//     console.log(products)
//     console.log(products.docs); // Verifica que products.docs contiene los datos esperados

//     // Renderiza la plantilla realTimeProducts con los datos obtenidos
//     res.render('realTimeProducts', {
//       docs: products.docs,
//       totalPages: products.totalPages,
//       hasPrevPage: products.hasPrevPage,
//       hasNextPage: products.hasNextPage,
//       prevLink: products.hasPrevPage
//         ? `/realtimeproducts?page=${products.prevPage}&limit=${limit}&sort=${sort}&query=${query}`
//         : null,
//       nextLink: products.hasNextPage
//         ? `/realtimeproducts?page=${products.nextPage}&limit=${limit}&sort=${sort}&query=${query}`
//         : null,
//     });
//   } catch (error) {
//     console.error("Error en la ruta /realtimeproducts:", error);
//     res.status(500).json({ status: 'error', message: error.message });
//   }
// });



/////////////////////////////////////////////////////////////////////////
///////////////Render en /api/realtimeproducts como json////////////////
////////////////////////////////////////////////////////////////////////
viewsRoutes.get('/api/realtimeproducts', async (req, res) => {
  try {
    const { page, limit, sort, query } = req.query;

    // Llama directamente al controlador para obtener los productos
    const products = await productController.getAllProducts(req, res);

    // Crea el objeto de respuesta 
    const response = {
      status: 'success', // O 'error' en caso de error
      payload: products,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.hasPrevPage
        ? `/realtimeproducts?page=${products.prevPage}&limit=${limit}&sort=${sort}&query=${query}`
        : null,
      nextLink: products.hasNextPage
        ? `/realtimeproducts?page=${products.nextPage}&limit=${limit}&sort=${sort}&query=${query}`
        : null,
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
    const product = await productController.getProductById(productId);

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

// renderizado de los productos en /products , aqui tambien se hace la gestion de filtrado por params mediante el controller
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
    const cid  = req.params.cid;
    const cart = await cartController.getCartById(cid);
    
    if (!cart) {
      return res.status(404).send('Carrito no encontrado');
    }
    // Renderiza una vista con los productos que pertenecen al carrito
    const products = cart.productos.map(product => ({ ...product.toObject() }));
     // Crear un arreglo para almacenar los detalles completos de los productos
    const productDetails = [];

    // Recorrer los productos en el carrito y buscar sus detalles en la base de datos
    for (const product of products) {
      const productDetail = await productController.getProductById(product.producto);
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

