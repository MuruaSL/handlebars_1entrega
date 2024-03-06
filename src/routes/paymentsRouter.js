// SDK de Mercado Pago
import { MercadoPagoConfig , Preference} from 'mercadopago';
import config from '../config/config.js';
import { Router } from 'express';
import nodemailer from 'nodemailer'

let access_token = config.accessToken
// Agrega credenciales
const client = new MercadoPagoConfig({ accessToken:access_token});
// Configurar las credenciales de acceso
const router = new Router()

// auto return de mercado pago urls
    router.get('/success-payment', async (req, res) => {
        res.render('success-payment');
        });

    router.get('/failure-payment', async (req, res) => {
        // Enviar correo electrónico de fallo
        await sendEmail('Fallo en la transacción', 'Tu transacción ha fallado.');
    
        res.render('failure-payment');
    });
    
    router.get('/pending-payment', async (req, res) => {
        // Enviar correo electrónico de pendiente
        await sendEmail('Transacción pendiente', 'Tu transacción está pendiente.');
    
        res.render('pending-payment');
    });
    

    router.post('/', async (req, res) => {
        try {
            const { items } = req.body;
            console.log("Datos recibidos en el servidor:", items);
    
            // Crear preferencia
            const preference = new Preference(client);
            const result = await preference.create({
                body: {
                    items: items,
                    back_urls:{
                        success:"https://handlebars1entrega-production.up.railway.app/create_preference/success-payment",
                        failure:"https://handlebars1entrega-production.up.railway.app/create_preference/failure-payment",
                        pending:"https://handlebars1entrega-production.up.railway.app/create_preference/pending-payment"
                    },
                    auto_return:"approved",
                }
            });
            
            // Enviar correo electrónico de éxito
            await sendEmail('Éxito en la transacción', 'Tu transacción ha sido exitosa.');
    
            res.json({
                id: result.id,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: "error al crear la preferencia"
            });
        }
    });



    // Configurar nodemailer con tus credenciales de correo electrónico
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.mailUser,
      pass: config.mailPass
    }
  });
// Función para enviar correos electrónicos
async function sendEmail(subject, text) {
    try {
        const mailOptions = {
            from: config.mailUser,
            to: config.mailUser,////// cambiar luego para adaptar que el usuario ingrese su mail porque MP no te lo da 
            subject: subject,
            text: text
        };

        // Enviar el correo electrónico
        await transporter.sendMail(mailOptions);
        console.log('Correo electrónico enviado con éxito.');
    } catch (error) {
        console.error('Error al enviar el correo electrónico:', error);
    }
}





export default router;