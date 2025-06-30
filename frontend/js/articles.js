document.addEventListener('DOMContentLoaded', async () => {
    console.log("Loading articles");
    const articlesDiv = document.getElementById('articles');
    const createMessageDiv = document.getElementById('createMessage');

    const loadArticles = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
            const response = await fetch('http://localhost:8000/articles', {
                headers
            });
            console.log("Articles response status:", response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const articles = await response.json();
            articlesDiv.innerHTML = '';
            if (articles.length === 0) {
                articlesDiv.innerHTML = '<p class="text-gray-600">No articles available.</p>';
                return;
            }
            articles.forEach(article => {
                const articleCard = document.createElement('div');
                articleCard.className = 'bg-white p-4 rounded-lg shadow-lg';
                articleCard.innerHTML = `
                    <h5 class="text-lg font-semibold">${article.title}</h5>
                    <p class="text-gray-600">${article.content}</p>
                    <p class="text-gray-500 text-sm">Public: ${article.is_public ? 'Yes' : 'No'}</p>
                `;
                articlesDiv.appendChild(articleCard);
            });
        } catch (error) {
            console.error("Articles loading error:", error);
            articlesDiv.innerHTML = '<p class="text-red-500">Failed to load articles. Please try again later.</p>';
        }
    };

    await loadArticles();

    document.getElementById('createArticleForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            createMessageDiv.innerText = 'Please login to create an article!';
            createMessageDiv.className = 'message-error';
            return;
        }
        const formData = {
            title: document.getElementById('title').value,
            content: document.getElementById('content').value,
            is_public: document.getElementById('is_public').checked
        };
        if (!formData.title || !formData.content) {
            createMessageDiv.innerText = 'Please fill in title and content!';
            createMessageDiv.className = 'message-error';
            return;
        }
        try {
            const response = await fetch('http://localhost:8000/articles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                createMessageDiv.innerText = 'Article created successfully!';
                createMessageDiv.className = 'message-success';
                document.getElementById('createArticleForm').reset();
                await loadArticles();
            } else {
                const errorData = await response.json();
                createMessageDiv.innerText = `Failed to create article: ${errorData.detail || 'Unknown error'}`;
                createMessageDiv.className = 'message-error';
            }
        } catch (error) {
            console.error("Article creation error:", error);
            createMessageDiv.innerText = 'Failed to create article: Network error';
            createMessageDiv.className = 'message-error';
        }
    });
});