const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const fetchArticles = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/articles`);
        if (!response.ok) throw new Error('Failed to fetch articles');
        return await response.json();
    } catch (error) {
        console.error("Error fetching articles:", error);
        // Return mock data if fetch fails (for testing UI without backend)
        return [
            {
                id: 1,
                title: "The Future of AI in Healthcare",
                excerpt: "Artificial intelligence is revolutionizing how we diagnose and treat diseases...",
                date: "2023-10-15",
                content: "Full content of the article here...",
                original_content: "Full content of the article here...",
                ai_content: "AI enhanced content..."
            },
            {
                id: 2,
                title: "Sustainable Living Tips",
                excerpt: "Small changes in your daily routine can have a big impact on the environment...",
                date: "2023-10-18",
                content: "Full content...",
                original_content: "Full content...",
                ai_content: "AI enhanced content..."
            },
            {
                id: 3,
                title: "React vs Vue: A Comparison",
                excerpt: "Choosing the right frontend framework for your next project...",
                date: "2023-10-20",
                content: "Full content...",
                original_content: "Full content...",
                ai_content: "AI enhanced content..."
            }
        ];
    }
};

export const fetchArticleById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/articles/${id}`);
        if (!response.ok) throw new Error('Failed to fetch article');
        return await response.json();
    } catch (error) {
        console.error(`Error fetching article ${id}:`, error);
        // Mock fallback
        return {
            id,
            title: "Sample Article Title",
            date: "2023-10-20",
            original_content: "This is the original content of the article. It is quite long and detailed.",
            ai_content: "This is the AI-enhanced version of the article. It has been summarized and optimized for clarity."
        };
    }
};
