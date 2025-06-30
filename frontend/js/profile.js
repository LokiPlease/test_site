document.addEventListener('DOMContentLoaded', async () => {
    console.log("Loading profile");
    const profileInfo = document.getElementById('profileInfo');
    const messageDiv = document.getElementById('message');

    const loadProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                messageDiv.innerText = 'Please login to view your profile!';
                messageDiv.className = 'message-error';
                window.location.href = 'login.html';
                return;
            }
            const response = await fetch('http://localhost:8000/users/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log("Profile response status:", response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const user = await response.json();
            profileInfo.innerHTML = `
                <p class="text-gray-800"><strong>Username:</strong> ${user.username}</p>
                <p class="text-gray-800"><strong>Email:</strong> ${user.email}</p>
                <p class="text-gray-800"><strong>Age:</strong> ${user.age}</p>
            `;
        } catch (error) {
            console.error("Profile loading error:", error);
            messageDiv.innerText = 'Failed to load profile. Please try again later.';
            messageDiv.className = 'message-error';
        }
    };

    await loadProfile();

    document.getElementById('updateProfileForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            messageDiv.innerText = 'Please login to update your profile!';
            messageDiv.className = 'message-error';
            return;
        }
        const formData = {
            email: document.getElementById('email').value,
            age: parseInt(document.getElementById('age').value) || undefined
        };
        if (!formData.email && !formData.age) {
            messageDiv.innerText = 'Please fill in at least one field!';
            messageDiv.className = 'message-error';
            return;
        }
        try {
            const response = await fetch('http://localhost:8000/users/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                messageDiv.innerText = 'Profile updated successfully!';
                messageDiv.className = 'message-success';
                document.getElementById('updateProfileForm').reset();
                await loadProfile();
            } else {
                const errorData = await response.json();
                messageDiv.innerText = `Failed to update profile: ${errorData.detail || 'Unknown error'}`;
                messageDiv.className = 'message-error';
            }
        } catch (error) {
            console.error("Profile update error:", error);
            messageDiv.innerText = 'Failed to update profile: Network error';
            messageDiv.className = 'message-error';
        }
    });
});