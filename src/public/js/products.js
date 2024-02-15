const socket = io();

//------------------------------------------------------------------------------//
//   Funcionalidad de agregar productos al carrito                              //
//------------------------------------------------------------------------------//


// para products.handlebars
// document.addEventListener("DOMContentLoaded", () => {
//     const productForms = document.querySelectorAll(".product-id");

//     productForms.forEach((productForm) => {
//         productForm.addEventListener("submit", async (event) => {
//             event.preventDefault();

//             // Obtener el valor del _id del formulario
//             const productId = event.target.dataset.id;
//             const userId = session.userId
//             console.log("USER id> "+userId+" Pid> "+productId )
//             // Emitir el evento addToCart al servidor
//             socket.emit('addToCart', productId ,userId);
//         });
//     });
// });
document.addEventListener("DOMContentLoaded", () => {
    const productForms = document.querySelectorAll(".product-id");
    
    // Obtener el ID del usuario del atributo de datos del cuerpo del documento
    const userId = document.body.dataset.userid;

    productForms.forEach((productForm) => {
        productForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            // Obtener el valor del _id del formulario
            const productId = event.target.dataset.id;

            // Emitir el evento addToCart al servidor, pasando el productId y el userId
            socket.emit('addToCart', { productId, userId });
        });
    });
});

