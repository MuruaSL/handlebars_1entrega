

// // Agrega este middleware después de configurar express y antes de definir tus rutas
// app.use('/realTimeProducts.js', (req, res, next) => {
//     res.type('text/javascript'); // Establece el tipo MIME a text/javascript
//     next();
// });

const socket = io(); // esta linea lo que hace es instanciar el socket del lado del cliente y se usarara como puente con el servidor


// socket.on('connection', () => {
//     console.log("Conectado al servidor de Socket.IO");
// });


socket.on('productos-actualizados', (productos) => {
    console.log("Productos actualizados:", productos);
    productos
});

socket.on('connection',()=>{
    console.log("cliente conectado")
})

// socketServer.emit("",)