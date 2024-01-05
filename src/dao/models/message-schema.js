import mongoose from "mongoose";

const chatCollection = 'messages';

const chatSchema = new mongoose.Schema({
    id: Number,
    user:String,
    message:String
});

const chatModel = mongoose.model(chatCollection, chatSchema);

export default chatModel;
