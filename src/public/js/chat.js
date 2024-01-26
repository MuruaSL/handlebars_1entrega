const socket = io();

const addMessageForm = document.getElementById("AddMessageToChat");

addMessageForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(AddMessageToChat);
  
  const user = formData.get("user")
  const message = formData.get("message")
  await socket.emit("addMessage", {user, message});
  location.reload();
});

