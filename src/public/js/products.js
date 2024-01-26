const socket = io();

//------------------------------------------------------------------------------//
//   Funcionalidad de agregar productos al carrito                              //
//------------------------------------------------------------------------------//


// para products.handlebars
document.addEventListener("DOMContentLoaded", () => {
    const productForms = document.querySelectorAll(".product-id");

    productForms.forEach((productForm) => {
        productForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            // Obtener el valor del _id del formulario
            const productId = event.target.dataset.id;

            // Emitir el evento addToCart al servidor
            socket.emit('addToCart', productId );
        });
    });
});