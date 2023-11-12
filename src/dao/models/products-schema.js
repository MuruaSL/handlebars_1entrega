import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = 'products';

const productSchema = new mongoose.Schema({
    id: Number,
    title: String,
    description: String,
    price: Number,
    code: {
        type: String,
        unique: true
    },
    stock: Number,
    status: Boolean,
    thumbnails: {
        type: [String],
        default: []
    }
});

productSchema.plugin(mongoosePaginate);
const productsModel = mongoose.model(productsCollection, productSchema);

export default productsModel;
