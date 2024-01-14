import chatServices from "../services/chat.services.js";


export const getMessages = async (req, res) => {
    try {
        const messages = await chatServices.getMessages();
        return messages;
        } catch (error) {
        console.error("Error al obtener los mensajes:", error);
        res.status(500).send("Error interno del servidor: " + error.message);
    }
};
  

export const addMessage = async (req, res) => {
    chatServices.addMessage({user,messaje})    
};

