
// const productMock = {
//     "title": faker.commerce.productName(),
//     "id": faker.number.int(20),
//     "description": faker.commerce.productDescription(),
//     "price": faker.commerce.price(),
//     "code": faker.number.int(20),
//     "stock": faker.number.int(20),
//     "status": true,
//     "thumbnails": [
//         "imagen1.jpg",
//         "imagen2.jpg"
//     ],
//     "owner": "65738a37e72a9cf6b8c16d30"
// };
import * as chai from 'chai';
import supertest from 'supertest'
import { faker } from '@faker-js/faker'

const expect = chai.expect;

const requester = supertest('http://localhost:8080'); // Crear el objeto de solicitud con la URL base
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////              SESSIONS             ///////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Test de sesión', function() {
    it('Debería iniciar sesión correctamente', function(done) {
        const credentials = {
            email: 'leonardo-murua@hotmail.com.ar',
            password: 'tortus123'
        };

        requester
            .post('/api/session/login')
            .send(credentials)
            .expect(302) // Espera un redireccionamiento
            .end(function(err, res) {
                if (err) return done(err);
                // Aquí podrías agregar más comprobaciones si lo deseas, por ejemplo, verificar si el redireccionamiento es correcto
                done();
            });
    });

    it('Debería devolver un error con credenciales incorrectas', function(done) {
        const credentials = {
            email: 'correo@incorrecto.com',
            password: 'contraseñaIncorrecta'
        };

        requester
            .post('/api/session/login')
            .send(credentials)
            .expect(403)
            .end(function(err, res) {
                if (err) return done(err);
                // Comprobación adicional si lo deseas
                done();
            });
    });

    it('Debería cerrar sesion correctamente', function(done) {
        const credentials = {
            email: 'leonardo-murua@hotmail.com.ar',
            password: 'tortus123'
        };

        requester
            .post('/api/session/logout')
            .send(credentials)
            .expect(302) // Espera un redireccionamiento
            .end(function(err, res) {
                if (err) return done(err);
                // Aquí podrías agregar más comprobaciones si lo deseas, por ejemplo, verificar si el redireccionamiento es correcto
                done();
            });
    });
    it('Debería no encontrar un usuario en sesión', function(done) {    
        requester
            .get('/api/session/')
            .expect(404) // Espera un código de estado HTTP 404 porque se cierran las sesiones antes
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    });
    
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////              PRODUCTS             ///////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Tests En products', function() {
    describe('Test de creación de producto', function() {
        let sessionCookie; // Variable para almacenar la cookie de sesión
        let productMock; // Variable para almacenar el producto creado en el primer test en la creacion (para luego eliminarlo)

        before(function(done) {
            // Antes de ejecutar las pruebas, iniciar sesión y obtener la cookie de sesión
            const credentials = {
                email: 'leonardo-murua@hotmail.com.ar',
                password: 'tortus123'
            };

            requester
                .post('/api/session/login')
                .send(credentials)
                .expect(302) // Espera un redireccionamiento
                .end(function(err, res) {
                    if (err) return done(err);
                    // Extraer la cookie de sesión de la respuesta
                    sessionCookie = res.headers['set-cookie'][0];
                    done();
                });
        });

        it('Debería crear un producto correctamente', function(done) {
            
            productMock = {
                "title": faker.commerce.productName(),
                "id": faker.number.int(20),
                "description": faker.commerce.productDescription(),
                "price": faker.commerce.price(),
                "code": faker.number.int(20),
                "stock": faker.number.int(20),
                "status": true,
                "thumbnails": [
                    "imagen1.jpg",
                    "imagen2.jpg"
                ],
                "owner": "65738a37e72a9cf6b8c16d30"
            };

            requester
                .post('/api/products')
                .set('Cookie', sessionCookie) // Establecer la cookie de sesión en la solicitud
                .send(productMock)
                .expect(201) // Esperar código de estado 201 para indicar que se ha creado correctamente
                .end(function(err, res) {
                    if (err) return done(err);
                    // Aquí podrías realizar más comprobaciones si lo deseas, como verificar la respuesta del servidor
                    done();
                });
        });
        
    });

    describe('Test de creación de producto con código duplicado', function() {
        let sessionCookie; // Variable para almacenar la cookie de sesión

        before(function(done) {
            // Antes de ejecutar las pruebas, iniciar sesión y obtener la cookie de sesión
            const credentials = {
                email: 'leonardo-murua@hotmail.com.ar',
                password: 'tortus123'
            };

            requester
                .post('/api/session/login')
                .send(credentials)
                .expect(302) // Espera un redireccionamiento
                .end(function(err, res) {
                    if (err) return done(err);
                    // Extraer la cookie de sesión de la respuesta
                    sessionCookie = res.headers['set-cookie'][0];
                    done();
                });
        });

        it('No debería crear un producto con código duplicado', function(done) {
            // Crear un producto con un código que ya existe en la base de datos
            const productMock = {
                "title": faker.commerce.productName(),
                "description": faker.commerce.productDescription(),
                "price": faker.commerce.price(),
                "code": "ASUSZENBOOKPRO", // Este código debe ser un código que ya exista en la base de datos
                "stock": faker.number.int({ min: 1, max: 100 }),
                "status": true,
                "thumbnails": [
                    "imagen1.jpg",
                    "imagen2.jpg"
                ],
                "owner": "65738a37e72a9cf6b8c16d30"
            };

            requester
                .post('/api/products')
                .set('Cookie', sessionCookie) // Establecer la cookie de sesión en la solicitud
                .send(productMock)
                .expect(500) // Esperar código de estado 400 para indicar que no se puede crear el producto
                .end(function(err, res) {
                    if (err) return done(err);
                    // Aquí podrías realizar más comprobaciones si lo deseas, como verificar el mensaje de error devuelto por la API
                    done();
                });
        });

        

    });
    describe('Test de Modificacion de producto', function() {
        let sessionCookie; // Variable para almacenar la cookie de sesión

        before(function(done) {
            // Antes de ejecutar las pruebas, iniciar sesión y obtener la cookie de sesión
            const credentials = {
                email: 'leonardo-murua@hotmail.com.ar',
                password: 'tortus123'
            };

            requester
                .post('/api/session/login')
                .send(credentials)
                .expect(302) // Espera un redireccionamiento
                .end(function(err, res) {
                    if (err) return done(err);
                    // Extraer la cookie de sesión de la respuesta
                    sessionCookie = res.headers['set-cookie'][0];
                    done();
                });
        });

        it('Debería actualizar la cantidad de un producto correctamente', function(done) {
            // Definir el cuerpo de la solicitud de actualización
            const updateBody = {
                "cantidad": 50 // Nuevo valor para la cantidad
            };

            requester
                .put("/api/products/6536fc8b5b2c03cff9980760") // Usar el ID del producto 1
                .set('Cookie', sessionCookie) // Establecer la cookie de sesión en la solicitud
                .send(updateBody)
                .expect(200) // Esperar código de estado 200 para indicar que se ha actualizado correctamente
                .end(function(err, res) {
                    if (err) return done(err);
                    // Aquí podrías realizar más comprobaciones si lo deseas, como verificar la respuesta del servidor
                    done();
                });
        });


    })
    describe('Test de obtencion de un objeto especifico',function(){
        let sessionCookie; // Variable para almacenar la cookie de sesión

        before(function(done) {
            // Antes de ejecutar las pruebas, iniciar sesión y obtener la cookie de sesión
            const credentials = {
                email: 'leonardo-murua@hotmail.com.ar',
                password: 'tortus123'
            };

            requester
                .post('/api/session/login')
                .send(credentials)
                .expect(302) // Espera un redireccionamiento
                .end(function(err, res) {
                    if (err) return done(err);
                    // Extraer la cookie de sesión de la respuesta
                    sessionCookie = res.headers['set-cookie'][0];
                    done();
                });
        });
        it('Debería obtener un producto específico correctamente', function(done) {
            requester
                .get('/api/products/6536fc8b5b2c03cff998076b') // Usar el ID de un producto conocido
                .set('Cookie', sessionCookie) // Establecer la cookie de sesión en la solicitud
                .expect(200) // Esperar código de estado 200 para indicar que se ha obtenido correctamente
                .end(function(err, res) {
                    if (err) return done(err);
                    // Aquí podrías realizar más comprobaciones si lo deseas, como verificar la respuesta del servidor
                    done();
                });
        });
    })
})
