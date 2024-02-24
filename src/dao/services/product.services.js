import productsModel from "../models/products-schema.js";
import { logger } from "../../logger.js";
class ProductService {
    async getAll() {
        try {
          const products = await productsModel.find().exec();
          return products;
        } catch (error) {
          throw new Error(
            "Error al obtener los productos de la base de datos: " + error.message
          );
        }
      }

async create(data) {
    const { title, description, price, code, stock, category, thumbnails, owner } =
    data;
    const newProduct = new productsModel({
    title,
    description,
    price,
    code,
    stock,
    category,
    owner,
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
        logger.debug("productID buscado en service : "+productId)
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

async filteredGetProducts({ page, limit, sort, queryField }) {
    try {
        const sortOptions = {};
        sortOptions[queryField] = sort === 'asc' ? 1 : -1;

        const filter = {};

        if (queryField == 'title') {
            filter.title = new RegExp(queryField, 'i');
        }

        if (queryField == 'priceRange') {
            const { minPrice, maxPrice } = req.query;
            filter.price = { $gte: minPrice, $lte: maxPrice };
        }

        if (queryField == 'category') {
            const { category } = req.query;
            filter.category = category;
        }

        const result = await productsModel.paginate(filter, {
            page,
            limit,
            lean: true,
            sort: sortOptions,
        });

        return result.docs || []; // Devolver los documentos o un array vacío si no hay resultados
    } catch (error) {
        throw new Error(
            "Error al obtener los productos filtrados de la base de datos: " + error.message
        );
    }
}

async getProductIdByCode(productCode) {
    try {
        const product = await productsModel.findOne({ code: productCode }).exec();
        if (product) {
            return product._id;
        } else {
            throw new Error("Producto no encontrado");
        }
    } catch (error) {
        throw new Error("Error al obtener el ID del producto por código: " + error.message);
    }
}

}




const productService = new ProductService();

export default productService;
