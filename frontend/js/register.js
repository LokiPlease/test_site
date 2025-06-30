document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        age: parseInt(document.getElementById('age').value),
        password: document.getElementById('password').value
    };
    console.log("Sending registration data:", formData);  // Отладочный вывод
    // Намеренный баг: нет валидации на фронте
    try {
        const response = await fetch('http://localhost:8000/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        console.log("Response status:", response.status);  // Отладочный вывод
        if (response.ok) {
            document.getElementById('message').innerText = 'Registration successful!';
            document.getElementById('message').className = 'message-success';
            setTimeout(() => { window.location.href = 'index.html'; }, 2000);
        } else {
            const errorData = await response.json();
            document.getElementById('message').innerText = `Registration failed: ${errorData.detail || 'Unknown error'}`;
            document.getElementById('message').className = 'message-error';
        }
    } catch (error) {
        console.error("Registration error:", error);  // Отладочный вывод
        document.getElementById('message').innerText = 'Registration failed: Network error';
        document.getElementById('message').className = 'message-error';
    }
});
