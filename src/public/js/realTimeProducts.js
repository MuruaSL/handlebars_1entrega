const socket = io(); // Esta línea instancia el socket del lado del cliente y se usará como puente con el servidor

socket.on('productos-actualizados', (productos) => {
    console.log("Productos actualizados:", productos);
    renderProductList(productos); // Llama a la función para renderizar la lista de productos
});

socket.on('connection', () => {
    console.log("Cliente conectado");
});

function renderProductList(products) {
    const productListContainer = document.getElementById("productList");
    if (!productListContainer) {
        // Verificar si el elemento existe en la página
        console.error("El contenedor de la lista de productos no se encontró.");
        return;
    }

    // Crear una cadena para almacenar el contenido HTML
    let productListHTML = "";

    // Recorrer el array de productos y construir el HTML
    products.forEach((product) => {
        productListHTML += `<div class="product-item">
            <h2>${product.title}</h2>
            <p>Precio: $${product.price}</p>
        </div>`;
    });

    // Asignar el HTML al contenedor
    productListContainer.innerHTML = productListHTML;
}
