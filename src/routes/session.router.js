import { Router } from "express";
import UserModel from '../dao/models/schemas/user-schema.js'
import { createHash, isValidPassword } from "../utils.js";

const sessionrouter = Router()

sessionrouter.post('/signup', async (req, res) => {
    const newUser = req.body;
    

    // Verifica si el correo electrónico sigue el patrón para el rol de administrador
    const isAdmin = /.*adminCoder@coder\.com.*/i.test(newUser.email);

    // Asigna el rol correspondiente
    newUser.role = isAdmin ? "admin" : "user";

    // Crea el usuario
    //primero hasheo
    newUser.password = createHash(req.body.password)
    await UserModel.create(newUser);

    res.redirect('/login');
});


sessionrouter.post('/login', async (req, res) => {
    const { email, password } = req.body
    const user = await UserModel.findOne({ email }).lean().exec()
    if(!user) return res.redirect('/login')
    if (!isValidPassword(user,password)) {
        return res.status(403).send({status:"error",error: "incorrect password"})
    }
    req.session.user = user

    res.redirect('/profile')
})

sessionrouter.get('/logout', async(req, res) => {
    req.session.destroy(err => {
        if(err) return res.send('Logout error')

        res.redirect('/')
    })
})


export default sessionrouter