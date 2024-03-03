// SDK de Mercado Pago
import { MercadoPagoConfig , Preference} from 'mercadopago';
import config from '../config/config.js';
import { Router } from 'express';

let access_token = config.accessToken
// Agrega credenciales
const client = new MercadoPagoConfig({ accessToken:access_token});
// Configurar las credenciales de acceso
const router = new Router()

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
                    success:"https://i.pinimg.com/736x/e8/de/a9/e8dea964ee60ba898cbeb98bd92659cb.jpg",
                    failure:"https://thumbs.dreamstime.com/z/tarjeta-de-error-pago-rechazada-fallo-electr%C3%B3nico-problema-transacci%C3%B3n-bancaria-m%C3%B3vil-tarjetas-d%C3%A9bito-cr%C3%A9dito-no-funciona-258548540.jpg",
                    pending:"https://c8.alamy.com/compes/dm775d/actualmente-se-encuentra-pendiente-de-pago-dm775d.jpg"
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