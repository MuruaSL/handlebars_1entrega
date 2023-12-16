import productManagerMongoose from "../managers/mongoose.productManager.js";



class ProductModel{
    constructor(){
        this.db = []
    }

    getAll = () => {
        this.db = productManagerMongoose.getProducts();
        return this.db;
    }
    

    create = data => {
        // data.id = this.db.length + 1
        this.db.push(data)

        return {
            result: true,
            dataNew: data
        }
    }

    update = (id,data) => {
        idx = this.db.findIndex(t => t.id == id)
        data.id = id

        this.db[idx] = data
        return{
            result:true,
            dataUpdated: data
        }
    }

}

export default ProductModel