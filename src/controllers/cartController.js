import cartManager from "../dao/managers/fs.cartManager.js";

// Crea un nuevo carrito
export const createCart = (req, res) => {
  try {
    const { products } = req.body;
    console.log(products); // Agrega esta línea para verificar los productos en la consola
    const newCart = cartManager.createCart(products);
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el carrito" });
  }
};
// Obtiene un carrito por su ID
export const getCartById = (req, res) => {
  const cartId = req.params.cartId;
  const cart = cartManager.getCartById(cartId);
  if (cart) {
    res.json(cart);
  } else {
    res.status(404).json({ error: "Carrito no encontrado" });
  }
};
// Agrega un producto al carrito
export const addToCart = (req, res) => {
  const cartId = req.params.cid;
  const productId = parseInt(req.params.pid); // Parsea el ID del producto como un número
  const { quantity } = req.body;
  try {
    const updatedCart = cartManager.addToCart(cartId, productId, quantity);
    res.json(updatedCart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
