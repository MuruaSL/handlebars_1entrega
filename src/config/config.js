import dotenv from 'dotenv';

const environment = 'DEVELOPMENT';
// const environment = 'PRODUCTION'
dotenv.config({
    path: environment === "DEVELOPMENT" ? './.env.development' : './.env.production'
});

const config = {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    mongoDBName: process.env.MONGO_DB_NAME,
    mailUser:process.env.MAIL_USER,
    mailPass:process.env.MAIL_PASS,
    jwtSecret: process.env.JWT_SECRET,
    accessToken:process.env.ACCESS_TOKEN,
    publicKey:process.env.PUBLIC_KEY,
};

export default config;
