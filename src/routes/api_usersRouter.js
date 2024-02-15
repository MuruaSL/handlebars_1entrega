import { Router } from "express";
import {isAuthenticated,isAdmin} from "../dao/modules/authUserModule.js"
import {changeRolePremium} from "../dao/controllers/usersController.js"
const api_userRouter = Router()

//si envias a /api/users/premium/:uid un post , anteriormente authenticado, y el autenticado es ADMIN de rol, puede cambiar el rol de otro usuario a premium
api_userRouter.post("/premium/:uid", isAuthenticated, isAdmin, changeRolePremium);




export default api_userRouter




