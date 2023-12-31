const socket = io()

//rescatar informacion de la pagina realTimeProducts
const addProductForm = document.getElementById("addProductForm");
const deleteProductForm = document.getElementById('deleteProductForm')

    
//------------------------------------------------------------------------------//
//   Funcionalidad de agregar productos mediante formulario, evento addProduct      //
//------------------------------------------------------------------------------//
addProductForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(addProductForm);
  const producto = {
    title: formData.get("title"),
    description: formData.get("description"),
    price: parseInt(formData.get("price")),
    code: formData.get("code"),
    stock: parseInt(formData.get("stock")),
    category: formData.get("category"),
    thumbnails: formData.get("thumbnails"),
  };
  socket.emit("addProduct", producto);
  
});

//------------------------------------------------------------------------------//
//   Funcionalidad de eliminar productos mediante formulario, evento deleteProduct      //
//------------------------------------------------------------------------------//
//aca debo agregar la funcionalidad de un nuevo formulario = emit desde el front (realTimeProducts.handlebars)
// y realizar en el back (app.js) el listener del evento eliminar producto en el socket 
//
deleteProductForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(deleteProductForm);
  const product_code = formData.get("code")
  socket.emit("deleteProduct", product_code);
});

