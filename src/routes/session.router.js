import { Router } from "express";
import UserModel from '../dao/models/user-schema.js'
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
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email }).lean().exec();
    if (!user || !isValidPassword(user, password)) {
        // Si el usuario no existe o la contraseña es incorrecta, devuelve un error
        return res.status(403).json({ status: 'error', error: 'Correo electrónico o contraseña incorrectos' });
    }
    req.session.user = user; // Establece la sesión del usuario
    res.redirect('/profile'); // Redirige a la página de perfil
});

sessionrouter.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            res.status(500).json({ message: 'Error interno del servidor' });
        } else {
            res.redirect('/login');
        }
    });
});

sessionrouter.get('/', (req, res) => {
    // Verifica si hay un usuario en la sesión
    const user = req.session.user;
    if (user) {
        // Si hay un usuario en la sesión, devuelve la información de usuario
        res.json({ userId: user._id, email: user.email, role: user.role });
    } else {
        // Si no hay un usuario en la sesión, devuelve un mensaje indicando que no hay sesión activa
        res.status(404).json({ message: 'No hay sesión activa' });
    }
});
export default sessionrouter