import chatServices from "../services/chat.services.js";


export const getMessages = async (req, res) => {
    try {
        const messages = await chatServices.getMessages();
        return messages;
        } catch (error) {
        req.logger.error("Error al obtener los mensajes:", error);
        res.status(500).send("Error interno del servidor: " + error.message);
    }
};


export const addMessage = async (messageData) => {
    try {
        const { user, message } = messageData; // Desestructura
        await chatServices.addMessage(user, message);
    } catch (error) {
        req.logger.error("Error al procesar el mensaje:", error);
        
    }
};


