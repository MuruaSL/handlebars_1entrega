import UserModel from "../models/user-schema.js";
import { logger } from "../../logger.js";


class UsersService {
    async changeRoleToPremium(uid) {
        try {
            const promotedUser = await UserModel.findByIdAndUpdate(uid, { role: 'premium' }, { new: true });
            if (!promotedUser) {
                throw new Error("Usuario no encontrado");
            }
            return promotedUser;
        } catch (error) {
            throw new Error("Error al promover un usuario: " + error.message);
        }
    }

    async update(uid, updatedData) {
        try {
        const updatedProduct = await productsModel
            .findByIdAndUpdate(productId, updatedData, { new: true })
            .exec();
        if (updatedProduct) {
            return updatedProduct;
        } else {
            throw new Error("Producto no encontrado");
        }
        } catch (error) {
        throw new Error("Error al actualizar el producto: " + error.message);
        }
    }
}



const UserService = new UsersService();

export default UserService;










