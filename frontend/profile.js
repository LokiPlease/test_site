document.addEventListener('DOMContentLoaded', async () => {
    console.log("Loading profile");
    const token = localStorage.getItem('token');
    if (!token) {
        document.getElementById('profileInfo').innerHTML = '<p class="text-danger">Please login to view your profile!</p>';
        return;
    }
    try {
        const response = await fetch('http://localhost:8000/users/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const user = await response.json();
            document.getElementById('profileInfo').innerHTML = `
                <p><strong>Username:</strong> ${user.username}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Age:</strong> ${user.age}</p>
            `;
            document.getElementById('email').value = user.email;
            document.getElementById('age').value = user.age;
        } else {
            const errorData = await response.json();
            document.getElementById('profileInfo').innerHTML = `<p class="text-danger">Failed to load profile: ${errorData.detail || 'Unknown error'}</p>`;
        }
    } catch (error) {
        console.error("Profile loading error:", error);
        document.getElementById('profileInfo').innerHTML = '<p class="text-danger">Failed to load profile: Network error</p>';
    }

    document.getElementById('updateProfileForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            email: document.getElementById('email').value,
            age: parseInt(document.getElementById('age').value)
        };
        try {
            const response = await fetch('http://localhost:8000/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                document.getElementById('message').innerText = 'Profile updated!';
                document.getElementById('message').className = 'message-success';
                document.dispatchEvent(new Event('DOMContentLoaded'));
            } else {
                const errorData = await response.json();
                document.getElementById('message').innerText = `Failed to update profile: ${errorData.detail || 'Unknown error'}`;
                document.getElementById('message').className = 'message-error';
            }
        } catch (error) {
            console.error("Profile update error:", error);
            document.getElementById('message').innerText = 'Failed to update profile: Network error';
            document.getElementById('message').className = 'message-error';
        }
    });
});