const socket = io();


    //------------------------------------------------------------------------------//
    //   Funcionalidad de agregar productos al carrito                              //
    //------------------------------------------------------------------------------//
    

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
                          // Mostrar una notificación
                        Toastify({
                        text: "!Producto agregado correctamente al carrito!",
                        duration: 3000, // Duración en milisegundos
                        newWindow: true,
                        close: true,
                        gravity: "top", // `top` o `bottom`
                        position: 'right', // `left`, `center` o `right`
                        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
                        }).showToast();
        });
    });
});
