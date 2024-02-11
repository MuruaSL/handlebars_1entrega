import winston from "winston";

// Define las opciones de nivel personalizado
const customLevelOption = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    }
}

// Configuración del logger para desarrollo
const developmentLogger = winston.createLogger({
    levels: customLevelOption.levels,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.simple()
        }),
    ]
});

// Configuración del logger para producción
const productionLogger = winston.createLogger({
    levels: customLevelOption.levels,
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.simple()
        }),
        new winston.transports.File({ filename: './errors.log', level: 'error' }),
    ]
});

// Selecciona el logger según el entorno
export const logger = process.env.NODE_ENV === 'production' ? productionLogger : developmentLogger;

// Middleware para añadir el logger a la solicitud
export const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.info(`[${req.method}] ${req.url} - ${new Date().toLocaleDateString()}`);
    next();
}


