const socket = io();

//------------------------------------------------------------------------------//
//   Funcionalidad de agregar productos al carrito                              //
//------------------------------------------------------------------------------//


// para products.handlebars
document.addEventListener("DOMContentLoaded", () => {
    const productForms = document.querySelectorAll(".product-id");

    productForms.forEach((productForm) => {
        console.log("productForm:", productForm);  // Agregamos este log para ver qué devuelve la selección
        productForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            // Obtener el valor del _id del formulario
            const productId = event.target.dataset.id;
            console.log('Product ID:', productId);

            // Emitir el evento addToCart al servidor
            socket.emit('addToCart', { productId });
        });
    });
});