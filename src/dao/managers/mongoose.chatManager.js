import MessageModel from "../models/message-schema.js"

class MessageManagerMongoose {
  // Agregar los métodos necesarios para interactuar con la base de datos MongoDB utilizando Mongoose

  async addMessage({ user,message }) {
    // Agregar la lógica para crear un nuevo producto en la base de datos utilizando el modelo de Mongoose
    const newMessage = new MessageModel({
      user,
      message
    });

    try {
      await newMessage.save();
      return newMessage;
    } catch (error) {
      throw new Error("Error al agregar el producto a la base de datos: " + error.message);
    }
  }

  async getMessages() {
    try {
      const messages = await MessageModel.find().lean().exec();
      return messages;
    } catch (error) {
      throw new Error("Error al obtener los productos de la base de datos: " + error.message);
    }
  }
}

export default new MessageManagerMongoose();
