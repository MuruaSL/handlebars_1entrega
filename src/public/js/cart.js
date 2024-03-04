// Selector de botones para eliminar productos
const removeButtons = document.querySelectorAll('.btn-remove');
// Selector de botones para restar una unidad
const decrementButtons = document.querySelectorAll('.btn-decrement');

// Event listener para eliminar productos del carrito
removeButtons.forEach(button => {
    button.addEventListener('click', async () => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "No podrás deshacer esta acción",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminarlo"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const productId = button.dataset.productId;
                const cartId = button.closest('.cart-container').dataset.cartId;

                try {
                    const deleteResponse = await fetch(`/cart/${cartId}/products/${productId}`, {
                        method: 'DELETE'
                    });

                    if (deleteResponse.ok) {
                        console.log('El producto ha sido eliminado del carrito.');
                        // Muestra una ventana modal de éxito
                        Swal.fire({
                            title: "¡Eliminado!",
                            text: "El producto ha sido eliminado del carrito.",
                            icon: "success"
                        }).then(() => {
                            // Recargar la página después de eliminar el producto
                            window.location.reload();
                        });
                    } else {
                        console.error('Error al eliminar el producto del carrito');
                    }
                } catch (error) {
                    console.error('Error de red:', error);
                }
            }
        });
    });
});


// Event listener para restar una unidad del producto en el carrito funcional
decrementButtons.forEach(button => {
    button.addEventListener('click', async () => {
        const productId = button.dataset.productId;
        console.log('ID del producto:', productId); // Verificar el ID del producto
        if (!productId) {
            console.error('ID de producto no definido');
            return;
        }
        const cartId = button.closest('.cart-container').dataset.cartId; // Obtener el ID del carrito desde el contenedor del carrito padre
        console.log('ID del carrito:', cartId); // Verificar el ID del carrito
        
        const productQuantity = button.parentElement.querySelector('#quantity').dataset.productQuantity; // Obtener la cantidad del producto desde el dataset
        console.log('Cantidad del producto:', productQuantity); // Verificar la cantidad del producto
        
        // Comprobar si la cantidad es mayor que 1
        if (productQuantity > 1) {
            try {
                // Hacer una solicitud al servidor para restar una unidad del producto en el carrito
                const response = await fetch(`/cart/product/${productId}/decrease/${cartId}`, {
                    method: 'PUT'
                });
                if (response.ok) {
                    // Recargar la página después de restar una unidad del producto
                    window.location.reload();
                } else {
                    console.error('Error al restar una unidad del producto en el carrito');
                }
                
                // Mostrar toast de éxito
                Toastify({
                    text: 'La cantidad del producto se ha decrementado en 1',
                    duration: 3000,
                    gravity: 'top',
                    position: 'right',
                    backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)',
                }).showToast();
            } catch (error) {
                console.error('Error de red:', error);
            }
        } else {
            try {
                // Mostrar confirmación antes de eliminar el producto del carrito
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: '¿Quieres eliminar este producto del carrito?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        // Hacer una solicitud al servidor para eliminar completamente el producto del carrito
                        const deleteResponse = await fetch(`/cart/${cartId}/products/${productId}`, {
                            method: 'DELETE'
                        });
                        if (deleteResponse.ok) {
                            console.log('El producto ha sido eliminado del carrito.');
                            window.location.reload();
                        } else {
                            console.error('Error al eliminar el producto del carrito');
                        }
                    }
                });
            } catch (error) {
                console.error('Error de red:', error);
            }
        }
    });
});

// Selector de botones para aumentar una unidad
const incrementButtons = document.querySelectorAll('.btn-increment');

// Event listener para aumentar una unidad del producto en el carrito funcional
incrementButtons.forEach(button => {
    button.addEventListener('click', async () => {
        const productId = button.dataset.productId;
        console.log('ID del producto:', productId); // Verificar el ID del producto
        if (!productId) {
            console.error('ID de producto no definido');
            return;
        }
        const cartId = button.closest('.cart-container').dataset.cartId; // Obtener el ID del carrito desde el contenedor del carrito padre
        console.log('ID del carrito:', cartId); // Verificar el ID del carrito
        
        try {
            // Hacer una solicitud al servidor para aumentar una unidad del producto en el carrito
            const response = await fetch(`/cart/product/${productId}/increase/${cartId}`, {
                method: 'PUT'
            });
            if (response.ok) {
                // Recargar la página después de aumentar una unidad del producto
                window.location.reload();
            } else {
                console.error('Error al aumentar una unidad del producto en el carrito');
            }
            
            // Mostrar toast de éxito
            Toastify({
                text: 'La cantidad del producto se ha aumentado en 1',
                duration: 3000,
                gravity: 'top',
                position: 'right',
                backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)',
            }).showToast();
        } catch (error) {
            console.error('Error de red:', error);
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    // Obtener todos los elementos de los subtotales de los productos
    const subtotalElements = document.querySelectorAll('.card-details p:nth-child(4)');

    // Inicializar el total como 0
    let total = 0;

    // Iterar sobre los elementos de los subtotales y sumar sus valores
    subtotalElements.forEach(subtotalElement => {
        // Obtener el valor del subtotal y convertirlo a un número flotante
        const subtotalValue = parseFloat(subtotalElement.textContent.replace('Subtotal: $', ''));
        // Sumar el subtotal al total
        total += subtotalValue;
    });

    // Actualizar el valor del elemento <span id="total">
    const totalElement = document.getElementById('total');
    totalElement.textContent = total.toFixed(2); // Redondear el total a 2 decimales
});


