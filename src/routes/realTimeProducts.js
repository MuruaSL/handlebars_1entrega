

// Agrega este middleware después de configurar express y antes de definir tus rutas
app.use('/realTimeProducts.js', (req, res, next) => {
    res.type('text/javascript'); // Establece el tipo MIME a text/javascript
    next();
});

/* `const socket = io();` is creating a new instance of the Socket.IO client and assigning it to the
`socket` constant. This allows the client to establish a connection with the Socket.IO server and
enables bidirectional communication between the client and the server. */
const socket = io();
/* The code `socket.on('connect', () => { console.log("Conectado al servidor de Socket.IO"); });` is
setting up an event listener for the 'connect' event emitted by the Socket.IO client. */
socket.on('connect', () => {
    console.log("Conectado al servidor de Socket.IO");
});

/* The code `socket.on('productos-actualizados', (productos) => {
    console.log("Productos actualizados:", productos);
    productos
});` is setting up an event listener for the 'productos-actualizados' event emitted by the Socket.IO
client. */
socket.on('productos-actualizados', (productos) => {
    console.log("Productos actualizados:", productos);
    productos
});
