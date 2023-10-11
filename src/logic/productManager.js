import  fs  from 'fs'
import  path  from 'path'

class ProductManager{
    //GlobalVars//
    static lastId = 0;
    static products = []

    constructor(pathExterna){
        //camino para el archivo de usuarios
        this.path = pathExterna
        
    }

    //functions//
    addProduct(title, description, price, code,stock,thumbnails) {
        // Validar que todos los campos sean obligatorios
        if (!title || !description || !price || !code || !stock ) {
            throw new Error("Los campos son obligatorios (Salvo thumbnails).");
        }
    
        // Cargar los productos existentes hasta el momento
        this.loadProducts();
    
        // Validar que "code" no se repita en el nuevo producto
        const codeExists = ProductManager.products.some((product) => product.code === code);
        if (codeExists) {
            console.log("El código del producto ya existe");
            throw new Error("El código del producto ya existe");
        }
    
        // Incrementar el lastId para el nuevo producto
        const ultimoId = ProductManager.products.length > 0 ? ProductManager.products[ProductManager.products.length - 1].id : 0;
        ProductManager.lastId = ultimoId + 1;
    
        // Crear un nuevo producto con un id autoincrementable y status true por defecto
        const newProduct = {
            id: ProductManager.lastId,
            title,
            description,
            price,
            thumbnail: thumbnails[0], // la primera imagen de thumbnails se setea por defecto 
            code,
            stock,
            status: true, // Establecer status en true por defecto
            thumbnails,
        };
    
        // Agregar el nuevo producto al arreglo de productos
        ProductManager.products.push(newProduct);
        this.updateProducts();
        return newProduct; // Devuelve el nuevo producto
    }
    
    
    
    //obtener los productos desde el json
    loadProducts() {
        try {
            const jsonData = fs.readFileSync(this.path, 'utf-8');
            ProductManager.products = JSON.parse(jsonData) || [];
            return ProductManager.products;
        } catch (error) {
            if (error.code === 'ENOENT') {
                fs.mkdirSync(path.dirname(this.path), { recursive: true });
                ProductManager.products = [];
                return [];
            } else {
                console.error('Error al cargar productos:', error);
                ProductManager.products = [];
                return [];
            }
        }
    }
    //actualiza un producto especificado obteniendo los datos por body
    updateProduct(productId, updatedFields) {

        //primero carga el array de productos porque sino en postman jamas pasa por esa secuencia y no se puede actualizar 
        this.loadProducts()
        // Definir una lista de campos permitidos en tus productos
        const camposPermitidos = ["title", "description", "price", "thumbnails", "code", "stock", "status"];
        // Verifica si el producto con el ID especificado existe
        const productIndex = ProductManager.products.findIndex((product) => product.id == productId);
        if (productIndex === -1) {
            throw new Error("Producto no encontrado");
        }
         // Verifica si "code" se va a actualizar
        if (updatedFields.hasOwnProperty("code")) {
        // busca en todos los productos
        const newCode = updatedFields.code;
        const isCodeDuplicated = ProductManager.products.some((product, index) => {
            // Verifica si el nuevo código es igual al código de algún otro producto,salvo del actual
            return index !== productIndex && product.code === newCode;
        });

        if (isCodeDuplicated) {
            throw new Error("El código ya existe en otro producto");
        }
        }
        // Verifica si se intenta actualizar el "id"

        if (updatedFields.hasOwnProperty("id") && updatedFields.id !== ProductManager.products[productIndex].id) {
        throw new Error("No se puede actualizar el campo 'id'");
        }
        // Verifica si se intenta actualizar el "id" o cualquier campo que no está en la lista de campos permitidos
        for (const key in updatedFields) {
            if (updatedFields.hasOwnProperty(key) && !camposPermitidos.includes(key)) {
                throw new Error(`El campo '${key}' no puede ser modificado`);
            }
        }
        // Actualiza los campos del producto con los valores proporcionados
        const updatedProduct = ProductManager.products[productIndex];
        
        // Actualiza solo los campos proporcionados en updatedFields
        // Verifica si se intenta actualizar el "id" o cualquier campo que no está en la lista de campos permitidos
        for (const key in updatedFields) {
            if (updatedFields.hasOwnProperty(key) && !camposPermitidos.includes(key)) {
                throw new Error(`El campo '${key}' no puede ser modificado`);
            }
        }


        // Reemplaza el producto antiguo con el producto actualizado en el arreglo de productos
        ProductManager.products[productIndex] = updatedProduct;

        // Actualiza el archivo JSON con los productos actualizados
        this.updateProducts();

        return updatedProduct;
    }
    

    //actualiza el array
    updateProducts() {
        fs.writeFileSync(this.path, JSON.stringify(ProductManager.products, null, 2), 'utf-8');
    }

    getProducts(){
        this.loadProducts()
        return ProductManager.products
    }


    getProductById(searchedID) {
        // Busca en el arreglo de productos de la instancia actual
        const product = this.getProducts().find((product) => product.id === searchedID);
        if (product) {
            return product;
        } else {
            throw new Error("Producto no encontrado");
        }
    }
    

    deleteProduct(idToDelete) {
        //se verifica que esten cargados los productos actualizados
        this.getProducts()
        // Buscar el índice del producto con el ID especificado
        const indexToDelete = ProductManager.products.findIndex((product) => product.id === idToDelete);
    
        if (indexToDelete !== -1) {
            // Si se encuentra el producto, eliminarlo del arreglo
            ProductManager.products.splice(indexToDelete, 1);
            this.updateProducts();
            return console.log(`Producto con ID ${idToDelete} eliminado exitosamente.`);
        } else {
            console.log(`Producto con ID ${idToDelete} no encontrado.`);
        }
    }
    
}
export default ProductManager;