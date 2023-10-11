import fs from 'fs';
import path from 'path';

class CartManager {
    constructor() {
        // Obtener la ruta del archivo actual
        const filePath = 'json/carrito.json';
        this.updateCarts(filePath)
    }
    updateCarts(filePath){
        if (!fs.existsSync(filePath)) {
            // Si el archivo no existe, crea la carpeta y el archivo
            const folderPath = path.dirname(filePath);
            fs.mkdirSync(folderPath, { recursive: true });
            fs.writeFileSync(filePath, '[]', 'utf-8');
        }

        // Leer y cargar los datos del archivo
        const cartData = fs.readFileSync(filePath, 'utf-8');
        this.carts = JSON.parse(cartData);
        this.lastCartId = this.calculateLastCartId();
    }
    // Calcula el último ID de carrito utilizado
    calculateLastCartId() {
        if (this.carts.length === 0) {
            return 0;
        }
        // Encuentra el máximo ID de carrito en la lista actual de carritos
        const maxCartId = this.carts.reduce((maxId, cart) => (cart.id > maxId ? cart.id : maxId), 0);
        return maxCartId;
    }

    // Crea un nuevo carrito y lo agrega a la lista
    createCart(products) {

        const newCart = {
            id: this.lastCartId + 1, // Incrementa el último ID de carrito
            products: products || [] // Lista de productos en el carrito Usa un array vacío si products no está definido
            
        };

        this.carts.push(newCart);
        this.lastCartId++; // Incrementa el último ID de carrito
        this.saveCartsToFile(); // Guarda los carritos actualizados en el archivo
        return newCart;
    }

    // Obtiene un carrito por su ID
    getCartById(cartId) {
        this.updateCarts('json/carrito.json'); // actualiza el listado de carritos
        const cart = this.carts.find(cart => cart.id == cartId);
        return cart;
        }       

    

    // Agrega un producto al carrito
    addToCart(cartId, productId, quantity) {
        const cart = this.getCartById(cartId);

        if (!cart) {
            throw new Error('Cart not found');
        }

        // Verifica si el producto ya existe en el carrito
        const existingProduct = cart.products.find(product => product.id === productId);

        if (existingProduct) {
            // Si el producto ya existe, incrementa la cantidad
            existingProduct.quantity += quantity;
        } else {
            // Si el producto no existe, agrégalo al carrito
            cart.products.push({
                id: productId,
                quantity
            });
        }
        this.saveCartsToFile(); // Guarda los carritos actualizados en el archivo
        return cart;
    }

    saveCartsToFile() {
        const filePath = 'json/carrito.json'; // Actualiza la ruta del archivo
        fs.writeFileSync(filePath, JSON.stringify(this.carts, null, 2), 'utf-8');
    }
}

export default CartManager;
