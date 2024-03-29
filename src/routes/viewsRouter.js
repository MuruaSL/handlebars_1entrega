import express from "express";
import passport from "passport";
import * as productController from '../dao/controllers/productController.js'
import * as cartController from "../dao/controllers/cartController.js";
import * as chatController from "../dao/controllers/chatController.js"
import { requestPasswordReset } from '../dao/controllers/authController.js';
import { resetPassword } from '../dao/controllers/authController.js';

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
////////////////////////////////////////////////
//////////// RUTA DE PERDIDA DE PASSWORD////////
////////////////////////////////////////////////

viewsRoutes.get('/forgot-password', (req, res) => {
  res.render('forgot-password');
});

viewsRoutes.post('/forgot-password', async (req, res) => {
  try {
    const userOrError = await requestPasswordReset(req.body.email);
    
    if (userOrError instanceof Error) {
      // Si hay un error, manejarlo adecuadamente
      console.error('Error al solicitar el restablecimiento de contraseña:', userOrError);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
    
    // Si el correo electrónico se envió correctamente, redirigir a la página de éxito
    res.redirect('/forgot-password-success');
  } catch (error) {
    console.error('Error al solicitar el restablecimiento de contraseña:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

/// una vez que ingresa al url del mail y envia la nueva contrasena, se entra a este post
viewsRoutes.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Lógica para restablecer la contraseña utilizando el token y la nueva contraseña
    await resetPassword(token, newPassword);

    // Redireccionar al usuario a una página de éxito o a la página de inicio de sesión
    res.redirect('/login');
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});


viewsRoutes.get('/forgot-password-success', (req, res) => {
  res.render('forgot-password-success');
});

viewsRoutes.get('/reset-password/:token', (req, res) => {
  const { token } = req.params;
  // Renderizar la página de restablecimiento de contraseña y pasar el token como contexto
  res.render('reset-password', { token });
});


//////////////////////////////////////////////////////////////////
//                      render de chat 
/////////////////////////////////////////////////////////////////

viewsRoutes.get("/chat", async (req, res) => {
  try {
    const AllMessages = await chatController.getMessages();
    res.render("chat", { AllMessages });
  } catch (error) {
    req.logger.error("Error en la página Chat:", error);
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
    req.logger.error("Error en la ruta /realtimeproducts:", error);
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
    req.logger.error('Error al obtener detalles del producto:', error);
    res.status(500).send('Error interno del servidor: ' + error.message);
  }
});

viewsRoutes.get("/products", async (req, res) => {
  if (!req.session?.user) {
    return res.redirect('/login')
  }
  try {
    const products = await productController.getAllProducts(req, res);
    const user = req.session.user; // Obtener la información del usuario de la sesión

    if (!products || !Array.isArray(products)) {
      // Si products es undefined o no es un array, devuelve un error
      throw new Error("Los productos no se han obtenido correctamente.");
    }

    // const productData = products.map(product => product.toObject());
    req.logger.info("Los productos se cargaron correctamente.");
    res.render('products', { user, products: products });
  } catch (error) {
    res.status(500).send("Error interno del servidor: " + error.message);
  }
});

// // renderizado de los productos en /products , aqui tambien se hace la gestion de filtrado por params mediante el controller
// viewsRoutes.get("/products", async (req, res) => {
//   try {
//     const products = await productController.getAllProducts(req, res);

//     if (!products || !Array.isArray(products)) {
//       // Si products es undefined o no es un array, devuelve un error
//       throw new Error("Los productos no se han obtenido correctamente.");
//     }

//     // const productData = products.map(product => product.toObject());
//     req.logger.info("Los productos se cargaron correctamente.");
//     res.render("products", {products});
//   } catch (error) {
//     req.logger.error("Error al obtener los productos:", error);
//     res.status(500).send("Error interno del servidor: " + error.message);
//   }
// });



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
    req.logger.error('Error al obtener el carrito:', error);
    res.status(500).send('Error interno del servidor: ' + error.message);
  }
});


//////////////////////////////////////////////////////////////////
//                      Vista control de logger 
/////////////////////////////////////////////////////////////////
viewsRoutes.get('/loggertest', (req, res) => {
      req.logger.info('info en /loggertest');
      req.logger.warning('warning en /loggertest');
      req.logger.debug('debug en /loggertest');
      req.logger.error('error en /loggertest');
      req.logger.fatal('FATAL en /loggertest');
      res.send('Mensajes de registro enviados correctamente');
      
})