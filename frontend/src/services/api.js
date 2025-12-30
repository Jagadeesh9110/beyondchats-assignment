const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const fetchArticles = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/articles`);
        if (!response.ok) throw new Error('Failed to fetch articles');
        const data = await response.json();
        return data.map(a => ({
            id: a._id,
            title: a.title,
            date: a.createdAt,
            excerpt: a.originalContent.slice(0, 120) + "...",
            originalContent: a.originalContent,
            aiContent: a.aiContent,
            references: a.references
        }));
    } catch (error) {
        console.error("Error fetching articles:", error.message);
        throw error;
    }
};

export const fetchArticleById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/articles/${id}`);
        if (!response.ok) throw new Error('Failed to fetch article');

        const data = await response.json();
        return {
            id: data._id,
            title: data.title,
            date: data.createdAt,
            originalContent: data.originalContent,
            aiContent: data.aiContent,
            references: data.references
        };
    } catch (error) {
        console.error(`Error fetching article ${id}:`, error.message);
        throw error;
    }
};
