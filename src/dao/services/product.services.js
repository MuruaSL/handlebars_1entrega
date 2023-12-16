import ProductModel from "../models/products.model.js"

class ProductService{
    constructor(){
        this.productModel = new ProductModel()
    }

    getAll = () =>{
        return this.productModel.getAll()
    }

    create = (data) => {
        return this.productModel.create(data)
    }

    turnOff = id => {
        this.productModel.update(id,{status:false})

        return true
    }





}



export default ProductService




