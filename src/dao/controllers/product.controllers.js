import ProductService from "../services/product.services.js";

const productService = new ProductService()

// export const getAll = (req, res) =>{
//     res.json(productService.getAll())
// }
export const getAll = async () => {
    try {
      // Espera la respuesta de productService.getAll() y retorna los datos
        return await productService.getAll();
    } catch (error) {
      // Manejo de errores si la llamada al servicio falla
        throw new Error("Error al obtener los productos: " + error.message);
    }
  };

export const create = (req, res) =>{
    const data = req.body
    res.json(productService.create(data))
}

export const turnOff = (req, res) =>{
    const id = parseInt(req.params.id)

    res.json(productService.turnOff(id))
}