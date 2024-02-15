import UserService from "../services/users.services.js"

export const changeRolePremium = async (req, res) => {
    try {
        const uid = req.params.uid;
        if (!uid) {
            throw new Error("No se indicó a qué usuario hacer premium");
        }

        const user = await UserService.changeRoleToPremium(uid);
        res.json(user);
    } catch (error) {
        console.error('Error al cambiar el rol del usuario:', error);
        res.status(500).send('Error interno del servidor: ' + error.message);
    }
};