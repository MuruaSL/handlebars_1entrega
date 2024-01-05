import productsModel from "../models/products-schema.js";

class ProductService {
    async getAll() {
        try {
          const products = await productsModel.find().exec();
        //   console.log('products en service> ' + products)
          return products;
        } catch (error) {
          throw new Error(
            "Error al obtener los productos de la base de datos: " + error.message
          );
        }
      }

async create(data) {
    const { title, description, price, code, stock, category, thumbnails } =
    data;
    const newProduct = new productsModel({
    title,
    description,
    price,
    code,
    stock,
    category,
    thumbnails
    });

    try {
    await newProduct.save();
    return newProduct;
    } catch (error) {
    throw new Error(
        "Error al agregar el producto a la base de datos: " + error.message
    );
    }
}

async getProductById(productId) {
    try {
    const product = await productsModel.findById(productId).exec();
    if (product) {
        return product;
    } else {
        throw new Error("Producto no encontrado");
    }
    } catch (error) {
    throw new Error("Error al obtener el producto por ID: " + error.message);
    }
}

async update(productId, updatedData) {
    try {
    const updatedProduct = await productsModel
        .findByIdAndUpdate(productId, updatedData, { new: true })
        .exec();
    if (updatedProduct) {
        return updatedProduct;
    } else {
        throw new Error("Producto no encontrado");
    }
    } catch (error) {
    throw new Error("Error al actualizar el producto: " + error.message);
    }
}

async delete(productId) {
    try {
    const deletedProduct = await productsModel
        .findByIdAndDelete(productId)
        .exec();
    if (deletedProduct) {
        return `Se eliminó el producto con ID: ${productId}`;
    } else {
        throw new Error("Producto no encontrado");
    }
    } catch (error) {
    throw new Error("Error al eliminar el producto: " + error.message);
    }
}
}

const productService = new ProductService();

export default productService;
