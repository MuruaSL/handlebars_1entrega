import productsModel from "../models/products-schema.js";

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

  async getProducts() {
    try {
      const products = await productsModel.find().exec();
      return products;
    } catch (error) {
      throw new Error("Error al obtener los productos de la base de datos: " + error.message);
    }
  }
  

  async getProductByCode(searchedCode) {
    try {
      const product = await productsModel.findOne({ code: searchedCode }).exec();
      if (product) {
        return product;
      } else {
        throw new Error("Producto no encontrado");
      }
    } catch (error) {
      throw new Error("Error al obtener el producto por code: " + error.message);
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

  async deleteProductById(product_id) {
    try {
      const product = await productsModel.findOne({ id: product_id }).exec();
      const id = product._id 
      if (product) {
        await productsModel.deleteOne({ _id: id });

      } else {
        throw new Error("Producto no encontrado");
      }
    } catch (error) {
      throw new Error("Error al obtener el producto por ID: " + error.message);
    }
  }
}


const productManagerMongoose = new ProductManagerMongoose();

export default productManagerMongoose;
