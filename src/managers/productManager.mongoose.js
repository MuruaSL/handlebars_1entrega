import productsModel from "../models/schemas/products-schema.js";

class ProductManagerMongoose {
  // Agregar los métodos necesarios para interactuar con la base de datos MongoDB utilizando Mongoose

  async addProduct({ title, description, price, code, stock, category, thumbnails }) {
    // Agregar la lógica para crear un nuevo producto en la base de datos utilizando el modelo de Mongoose
    const newProduct = new productsModel({
      title,
      description,
      price,
      code,
      stock,
      category,
      thumbnails,
    });

    try {
      await newProduct.save();
      return newProduct;
    } catch (error) {
      throw new Error("Error al agregar el producto a la base de datos: " + error.message);
    }
  }

  // Implementar otros métodos para actualizar, obtener y eliminar productos utilizando Mongoose

  async getProducts() {
    try {
      const products = await productsModel.find().exec();
      return products;
    } catch (error) {
      throw new Error("Error al obtener los productos de la base de datos: " + error.message);
    }
  }

  async getProductById(searchedID) {
    try {
      const product = await productsModel.findOne({ id: searchedID }).exec();
      if (product) {
        return product;
      } else {
        throw new Error("Producto no encontrado");
      }
    } catch (error) {
      throw new Error("Error al obtener el producto por ID: " + error.message);
    }
  }

  // Implementar otros métodos para actualizar, eliminar y realizar otras operaciones con productos
}

const productManagerMongoose = new ProductManagerMongoose();

export default productManagerMongoose;
