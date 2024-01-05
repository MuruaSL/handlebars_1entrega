import passport from "passport";
import GitHubStrategy from 'passport-github2'
import UserModel from "../dao/models/user-schema.js";


const initializePassport = ()=>{

    passport.use('github',new GitHubStrategy(
        {
            //parametros de inicializacion sacados desde githubApps
            clientID:'Iv1.1abb0961d41e400f',
            clientSecret:'2976d44afa2773a5ef9d128c20dfdb4b7c7ce4de',
            callbackURL:'http://127.0.0.1:8080/githubcallback'
        },
        async (accessToken, refreshToken, profile, done)=>{
            // clg para mostrar los datos obtenidos de github
            // console.log(profile)

            try {
                // intentar conectar a la app y recibir los datos del usuario
                // si el usuario existe, se da un mensaje
                const user = await UserModel.findOne({email: profile._json.email})
                if (user) {
                    console.log('user already exist')
                    return done(null,user)
                }
                // si no existe se extraen los datos de la data que nos manda github y 
                // se guardan los datos del usuario en nuestro modelo
                const newUser = {
                    first_name: profile._json.name,
                    last_name:profile._json.last_name,
                    email:profile._json.email,
                    password:profile._json.password
                }
                //luego que se guardan los datos se crea el usuario
                const result = await UserModel.create(newUser)
                return done(null, result)
            } catch (error) {
                return done('Error to login with github '+ error)
            }
        }
    ))



    passport.serializeUser((user,done)=>{
        done(null, user._id)
    })

    passport.deserializeUser(async(_id,done)=>{
        const user = await UserModel.findById(_id)
        done(null, user)
    })
}


export default initializePassport



































