document.addEventListener("DOMContentLoaded", () => {
    const logoutForm = document.getElementById('logoutForm');
    logoutForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        try {
        const response = await fetch('/api/session/logout', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            }
        });
        if (response.redirected) {
            window.location.href = response.url;
        }
        } catch (error) {
        console.error('Error al cerrar sesión:', error);
        }
    });
    });