document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        };
        console.log("Sending login data:", formData);
        try {
            const response = await fetch('http://localhost:8000/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            console.log("Response status:", response.status);
            if (response.ok) {
                const data = await response.json();
                console.log("Token received:", data.access_token);
                localStorage.setItem('token', data.access_token);
                console.log("Token saved in localStorage:", localStorage.getItem('token'));
                document.getElementById('message').innerText = 'Login successful!';
                document.getElementById('message').className = 'message-success';
                setTimeout(() => { window.location.href = 'profile.html'; }, 2000);
            } else {
                const errorData = await response.json();
                document.getElementById('message').innerText = `Login failed: ${errorData.detail || 'Unknown error'}`;
                document.getElementById('message').className = 'message-error';
            }
        } catch (error) {
            console.error("Login error:", error);
            document.getElementById('message').innerText = 'Login failed: Network error';
            document.getElementById('message').className = 'message-error';
        }
    });
});