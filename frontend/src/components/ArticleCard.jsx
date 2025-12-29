import React from 'react';
import { useNavigate } from 'react-router-dom';

const ArticleCard = ({ article }) => {
    const navigate = useNavigate();

    return (
        <div className="article-card" onClick={() => navigate(`/article/${article.id}`)}>
            <h2>{article.title}</h2>
            <div className="article-date">{new Date(article.date).toLocaleDateString()}</div>
            <p className="article-excerpt">{article.excerpt}</p>
            <span className="read-more">Read Article →</span>
        </div>
    );
};

export default ArticleCard;
