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
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId, // Tipo ObjectId para hacer referencia al ID del usuario
        ref: 'users' // Referencia al modelo de usuarios
    }
});

productSchema.plugin(mongoosePaginate);
const productsModel = mongoose.model(productsCollection, productSchema);

export default productsModel;



// import mongoose from "mongoose";
// import mongoosePaginate from "mongoose-paginate-v2";

// const productsCollection = 'products';

// const productSchema = new mongoose.Schema({
//     id: Number,
//     title: String,
//     description: String,
//     price: Number,
//     code: {
//         type: String,
//         unique: true
//     },
//     stock: Number,
//     status: Boolean,
//     thumbnails: {
//         type: [String],
//         default: []
//     }
// });

// productSchema.plugin(mongoosePaginate);
// const productsModel = mongoose.model(productsCollection, productSchema);

// export default productsModel;
