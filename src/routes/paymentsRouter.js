// SDK de Mercado Pago
import { MercadoPagoConfig , Preference} from 'mercadopago';
import config from '../config/config.js';
import { Router } from 'express';

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
    res.render('failure-payment');
});

router.get('/pending-payment', async (req, res) => {
    res.render('pending-payment');
});

router.post('/', async (req, res) => {
    try {
        const { items } = req.body;
        console.log("Datos recibidos en el servidor:", items); // Agrega este console.log para verificar los datos recibidos en el servidor

        console.log(items); // Imprimir los items recibidos por consola
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
        console.log("Resultado de la creación de preferencia:", result); // Agrega este console.log para verificar el resultado de la creación de la preferencia

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






export default router;