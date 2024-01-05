import { Router } from "express";
import {getAllProducts,createProduct,getProductById,updateProduct,deleteProduct} from '../controllers/productController.js'

const productsRouter = Router()

productsRouter.get('/', getAllProducts)
productsRouter.post("/:pid",getProductById)
productsRouter.post("/", createProduct)
productsRouter.put("/", updateProduct)
productsRouter.delete("/",deleteProduct)



