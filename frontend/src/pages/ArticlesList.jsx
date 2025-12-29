import React, { useEffect, useState } from 'react';
import ArticleCard from '../components/ArticleCard';
import { fetchArticles } from '../services/api';

const ArticlesList = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadArticles = async () => {
            try {
                const data = await fetchArticles();
                setArticles(data);
            } catch {
                setError('Failed to load articles');
            } finally {
                setLoading(false);
            }
        };

        loadArticles();
    }, []);

    if (loading) return <div className="container">Loading articles...</div>;
    if (error) return <div className="container" style={{ color: 'red' }}>{error}</div>;

    return (
        <div className="container">
            <h1 style={{ marginBottom: '2rem' }}>Latest Articles</h1>
            <div className="articles-grid">
                {articles.map(article => (
                    <ArticleCard key={article.id} article={article} />
                ))}
            </div>
        </div>
    );
};

export default ArticlesList;
