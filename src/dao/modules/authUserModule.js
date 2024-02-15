//authMiddleware

export const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        // Si el usuario está autenticado, continúa con la siguiente middleware
        next();
    } else {
        // Si el usuario no está autenticado, devuelve un error de autorización
        res.status(401).json({ message: 'Usuario no autenticado' });
    }
};

export const isAdmin = (req, res, next) => {
    if (req.session.user.role == "admin") {
        // Si el usuario está autenticado, continúa con la siguiente middleware
        next();
    } else {
        // Si el usuario no está autenticado, devuelve un error de autorización
        res.status(401).json({ message: 'Usuario no autenticado' });
    }
};