import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchArticleById } from '../services/api';

const ArticleDetail = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('original'); // 'original' or 'ai'

    useEffect(() => {
        const loadArticle = async () => {
            try {
                const data = await fetchArticleById(id);
                setArticle(data);
            } catch {
                setError('Failed to load article details');
            } finally {
                setLoading(false);
            }
        };

        loadArticle();
    }, [id]);

    if (loading) return <div className="container">Loading...</div>;
    if (error) return <div className="container" style={{ color: 'red' }}>{error}</div>;
    if (!article) return <div className="container">Article not found</div>;

    return (
        <div className="container">
            <Link to="/" className="back-link">← Back to Articles</Link>

            <div className="article-detail">
                <div className="detail-header">
                    <h1>{article.title}</h1>
                    <div className="article-date">Published on {new Date(article.date).toLocaleDateString()}</div>
                </div>

                <div className="toggle-container">
                    <button
                        className={`toggle-btn ${viewMode === 'original' ? 'active' : ''}`}
                        onClick={() => setViewMode('original')}
                    >
                        Original Version
                    </button>
                    <button
                        className={`toggle-btn ${viewMode === 'ai' ? 'active' : ''}`}
                        onClick={() => setViewMode('ai')}
                    >
                        AI Enhanced
                    </button>
                </div>

                <div className="content-display">
                    {viewMode === 'original' ? (
                        <div>
                            {article.original_content || article.content}
                        </div>
                    ) : (
                        <div>
                            {article.ai_content || "No AI enhancement available for this article."}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArticleDetail;
