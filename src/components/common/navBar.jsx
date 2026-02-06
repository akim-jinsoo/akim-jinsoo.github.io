import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import INFO from "../../data/user";
import "./styles/navBar.css";

const NavBar = (props) => {
    const { active } = props;

    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);
    const [theme, setTheme] = useState(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [wrapperRef]);

    useEffect(() => {
        // initialize theme from localStorage or prefers-color-scheme
        try {
            const stored = localStorage.getItem('theme');
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            const initial = stored || (prefersDark ? 'dark' : 'light');
            setTheme(initial);
            document.documentElement.setAttribute('data-theme', initial);
        } catch (e) {
            // ignore storage errors
        }
    }, []);

    return (
        <React.Fragment>
            <div className="nav-container">
                {/* Small button to re-open the splash (clears sessionStorage key and reloads) - only on homepage */}
                {active === "home" && (
                    <button
                        className="splash-toggle"
                        aria-label="Back to splash"
                        title="Show splash"
                        onClick={() => {
                            try { sessionStorage.removeItem('seenSplash'); } catch (e) {}
                            // reload so SplashGate sees no key and shows again
                            window.location.reload();
                        }}
                    >
                        ⟲
                    </button>
                )}

                <button
                    className="theme-toggle"
                    aria-pressed={theme === 'dark'}
                    aria-label="Toggle dark mode"
                    onClick={() => {
                        const next = theme === 'dark' ? 'light' : 'dark';
                        setTheme(next);
                        try { localStorage.setItem('theme', next); } catch (e) {}
                        document.documentElement.setAttribute('data-theme', next);
                    }}
                >
                    {theme === 'dark' ? '🌙' : '☀️'}
                </button>
                <nav className="navbar">
                    <div className="nav-background">
                        <ul className="nav-list">
                            <li className={active === "home" ? "nav-item active" : "nav-item"}>
                                <Link to="/">Home</Link>
                            </li>

                            {/* Experience with dropdown */}
                            <li
                                ref={wrapperRef}
                                className={(active === "experience" ? "nav-item experience-item active" : "nav-item experience-item") + (open ? " open" : "")}
                                onMouseEnter={() => setOpen(true)}
                                onMouseLeave={() => setOpen(false)}
                            >
                                <Link to="/experience" aria-haspopup="true" aria-expanded={open}>
                                    Experience
                                </Link>

                                {/* caret button toggles dropdown on click (useful for mobile) */}
                                <button
                                    type="button"
                                    className="dropdown-toggle"
                                    aria-label="Toggle experience menu"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpen((v) => !v);
                                    }}
                                >
                                    ▾
                                </button>

                                <ul className="nav-dropdown">
                                    {(() => {
                                        // Group projects by category in the same order as the Experience page
                                        const order = [
                                            { key: "research", label: "Research" },
                                            { key: "internship", label: "Internships" },
                                            { key: "course", label: "Course Projects" },
                                        ];
                                        const groups = order.map((o) => ({ ...o, items: [] }));
                                        INFO.projects.forEach((p) => {
                                            const idx = order.findIndex((o) => o.key === p.category);
                                            if (idx >= 0) groups[idx].items.push(p);
                                        });

                                        // Only render separators between populated groups (avoid trailing separator)
                                        const populated = groups.filter((g) => g.items && g.items.length > 0);
                                        return populated.map((g, gi) => (
                                            <React.Fragment key={g.key}>
                                                <li className="nav-dropdown-section-title">{g.label}</li>
                                                {g.items.map((p) => (
                                                    <li key={p.slug} className="nav-dropdown-item">
                                                        <Link to={`/project/${p.slug}`} onClick={() => setOpen(false)}>
                                                            {p.title}
                                                        </Link>
                                                    </li>
                                                ))}
                                                {gi < populated.length - 1 ? (
                                                    <li className="nav-dropdown-separator" aria-hidden="true"></li>
                                                ) : null}
                                            </React.Fragment>
                                        ));
                                    })()}
                                </ul>
                            </li>
                            <li className={active === "publications" ? "nav-item active" : "nav-item"}>
                                <Link to="/publications">Publications</Link>
                            </li>

                            <li className="nav-item">
                                <a href="./resume.pdf" target="_blank" rel="noreferrer">
                                    Resume
                                </a>
                            </li>

                            {/* Contact page removed */}
                        </ul>
                    </div>
                </nav>
            </div>
        </React.Fragment>
    );
};

export default NavBar;
