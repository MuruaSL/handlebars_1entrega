const socket = io();

//------------------------------------------------------------------------------//
//   Funcionalidad de agregar productos al carrito evento addProductToCart      //
//------------------------------------------------------------------------------//
const productForm = document.getElementById("addProductToCart");

// para productDetail.handlebars
productForm.addEventListener("submit", async (event) => {
    event.preventDefault();

        // Obener el valor del _id del formulario
        const productId = productForm.dataset.id;
        console.log('Product ID:', productId);
    
        // Emitir el evento addToCart al servidor
        socket.emit('addToCart', { productId });
});