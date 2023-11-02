const socket = io();

const addMessageForm = document.getElementById("AddMessageToChat");

addMessageForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(AddMessageToChat);
  const message = {
    user: formData.get("user"),
    message: formData.get("message"),
  };
  await socket.emit("addMessage", message);
  location.reload();
});
