import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="container nav-content">
                <Link to="/" className="nav-brand">ArticleEnhancer</Link>
                <div className="nav-links">
                    <Link to="/">Home</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
