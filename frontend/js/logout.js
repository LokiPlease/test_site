document.addEventListener('DOMContentLoaded', () => {
    console.log("logout.js loaded");
    const logoutButton = document.getElementById('logoutButton');
    const loginLink = document.getElementById('navLogin');
    const registerLink = document.getElementById('navRegister');
    
    if (!logoutButton || !loginLink || !registerLink) {
        console.error("One or more navigation elements not found:", {
            logoutButton: !!logoutButton,
            loginLink: !!loginLink,
            registerLink: !!registerLink
        });
        return;
    }

    const token = localStorage.getItem('token');
    console.log("Token found in localStorage:", token);

    if (token) {
        console.log("Showing logout button, hiding login/register");
        logoutButton.style.display = 'flex'; // Tailwind 'flex' для соответствия стилям
        loginLink.style.display = 'none';
        registerLink.style.display = 'none';
    } else {
        console.log("Hiding logout button, showing login/register");
        logoutButton.style.display = 'none';
        loginLink.style.display = 'flex';
        registerLink.style.display = 'flex';
    }

    logoutButton.addEventListener('click', () => {
        console.log("Logout button clicked");
        localStorage.removeItem('token');
        console.log("Token removed from localStorage");
        window.location.href = 'login.html';
    });
});