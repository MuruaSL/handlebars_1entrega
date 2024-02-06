import winston from "winston"

const customLevelOption = {
    levels:{
        fatal:0,
        error:1,
        warning:2,
        info:3,
        http:4,
        debugg:5
    }
}

export const logger = winston.createLogger({
    levels:customLevelOption.levels,
    transports:[
        new winston.transports.Console({level:'http'}),
        new winston.transports.File({filename:'./errors.log',level:'1'}),
    ]
})


export const addLogger = (req,res,next)=>{
    req.logger = logger
    req.logger.http(`[${req.method}] ${req.url} - ${new Date().toLocaleDateString()}`)
    next()
}












