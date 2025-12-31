import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchArticleById } from "../services/api";
import ReactMarkdown from "react-markdown";

const ArticleDetail = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState("original"); // original | ai

    useEffect(() => {
        const loadArticle = async () => {
            try {
                const data = await fetchArticleById(id);
                setArticle(data);
            } catch {
                setError("Failed to load article details");
            } finally {
                setLoading(false);
            }
        };

        loadArticle();
    }, [id]);

    if (loading) return <div className="container">Loading...</div>;
    if (error)
        return (
            <div className="container" style={{ color: "red" }}>
                {error}
            </div>
        );
    if (!article) return <div className="container">Article not found</div>;

    return (
        <div className="container">
            <Link to="/" className="back-link">
                ← Back to Articles
            </Link>

            <div className="article-detail">
                <div className="detail-header">
                    <h1>{article.title}</h1>
                    <div className="article-date">
                        Published on{" "}
                        {article.publishedAt
                            ? new Date(article.publishedAt).toLocaleDateString()
                            : "N/A"}
                    </div>
                </div>

                <div className="toggle-container">
                    <button
                        className={`toggle-btn ${viewMode === "original" ? "active" : ""
                            }`}
                        onClick={() => setViewMode("original")}
                    >
                        Original Version
                    </button>

                    <button
                        className={`toggle-btn ${viewMode === "ai" ? "active" : ""}`}
                        onClick={() => setViewMode("ai")}
                    >
                        AI Enhanced
                    </button>
                </div>

                <div className="content-display">
                    {viewMode === "original" ? (
                        <div>{article.originalContent}</div>
                    ) : (
                        <div>
                            {article.aiContent ? (
                                <>
                                    {/* Render AI markdown WITHOUT embedded references */}
                                    <ReactMarkdown>
                                        {article.aiContent.replace(/## References[\s\S]*/i, "")}
                                    </ReactMarkdown>

                                    {/* Render structured references ONCE */}
                                    {article.references?.length > 0 && (
                                        <>
                                            <h3 style={{ marginTop: "2rem" }}>References</h3>
                                            <ul>
                                                {article.references.map((ref, i) => (
                                                    <li key={i}>
                                                        <a
                                                            href={ref.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            {ref.title}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    )}
                                </>
                            ) : (
                                <p>No AI enhancement available for this article.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArticleDetail;
