import mongoose from "mongoose";

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

const productsModel = mongoose.model(productsCollection, productSchema);

export default productsModel;
