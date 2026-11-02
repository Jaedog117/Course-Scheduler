import React from 'react';
import {Link, useLocation} from 'react-router-dom';

const NavBar = () => {
    const location = useLocation();

    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark shadow-sm">
            <div className="container">
                {/* Brand Title */}
                <Link className="navbar-brand fw-bold" to="/">
                    Aurora CS Course Scheduler
                </Link>

                {/* Links Alignment */}
                <div className="navbar-nav ms-auto">
                    <Link
                        className={`nav-link px-3 fw-semibold ${location.pathname === '/' ? 'active text-white' : ''}`}
                        to="/"
                    >
                        Home
                    </Link>
                    <Link
                        className={`nav-link px-3 fw-semibold ${location.pathname === '/about' ? 'active text-white' : ''}`}
                        to="/about"
                    >
                        About
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
