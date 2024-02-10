import winston from "winston"

const customLevelOption = {
    levels:{
        fatal:0,
        error:1,
        warning:2,
        info:3,
        http:4,
        debug:5
    }
}

export const logger = winston.createLogger({
    levels:customLevelOption.levels,
    transports:[
        new winston.transports.Console({
            level:'http',
            format:winston.format.simple()
        }),
        new winston.transports.File({ filename: './errors.log',level:'error'}),
    ]
})


export const addLogger = (req,res,next)=>{
    req.logger = logger

    req.logger.info(`[${req.method}] ${req.url} - ${new Date().toLocaleDateString()}`)
    
    next()
}












