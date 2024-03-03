// import config from "../../config/config.js"


const  createCheckoutButton = (preferenceId)=>{
    const bricksBuilder = mp.bricks();
    const renderComponent = async()=>{
        if (window.checkoutButton) window.checkoutButton.unmount()
        
        await bricksBuilder.create("wallet", "wallet_container", {
            initialization: {
                preferenceId: preferenceId,
            },
            customization: {
            texts: {
            valueProp: 'smart_option',
            },
            },
        });
    }
    
    renderComponent()
}
// //para produccion
// const mp = new MercadoPago("APP_USR-9339837f-0639-4512-98fd-977432fd22c5",{
//     locale: 'es-AR'
// });    

// para develop
const mp = new MercadoPago("TEST-1b4718c4-73c3-43d7-b456-c1e46a5ae8a1",{
    locale: 'es-AR'
});    
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("checkout-btn").addEventListener("click", async () => {
        try {
            const products = Array.from(document.querySelectorAll(".card"));
            const orderData = products.map(product => {
                const unitPrice = parseFloat(product.querySelector("#unit-price").innerText.replace("$", "").replace(/\D+/g, ''));
                const adjustedUnitPrice = unitPrice / 100; 
                // Mover la coma a la izquierda dos lugares
                // sino MP calcula mal los totales 
                return {
                    title: product.querySelector("#product-description").innerText,
                    quantity: parseInt(product.querySelector("#quantity").innerText.replace(/\D+/g, '')),
                    unit_price: adjustedUnitPrice
                };
            });    
            console.log("Datos de la orden enviados al servidor:", orderData); // Agrega este console.log para verificar los datos antes de enviarlos al servidor

            const response = await fetch("http://localhost:8080/create_preference", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ items: orderData })
            });

            const preference = await response.json();
            const preferenceId = preference.id;
            console.log("preference> " + JSON.stringify(preference));
            console.log("pid>" + preferenceId);
            createCheckoutButton(preferenceId);
        } catch (error) {
            console.log(error);
        }
    });
});
