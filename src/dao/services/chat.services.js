import MessageModel from "../models/message-schema.js"

class chatServices {
  // Agregar los métodos necesarios para interactuar con la base de datos MongoDB utilizando Mongoose

  async addMessage(user, message) {
    console.log("messageData en chatServices: " + user + "message> " + message);

    if (!user || !message) {
        throw new Error("Datos de mensaje incompletos");
    }

    const newMessage = new MessageModel({
        user,
        message
    });

    try {
        await newMessage.save();
        return newMessage;
    } catch (error) {
        throw new Error("Error al agregar el mensaje a la base de datos: " + error.message);
    }
}





  async getMessages() {
    try {
        const messages = await MessageModel.find().lean().exec();
        return messages;
    } catch (error) {
        throw new Error("Error al obtener mensajes de la base de datos: " + error.message);
    }
}
}

export default new chatServices();