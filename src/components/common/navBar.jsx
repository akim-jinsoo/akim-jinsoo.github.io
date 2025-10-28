import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import INFO from "../../data/user";
import "./styles/navBar.css";

const NavBar = (props) => {
    const { active } = props;

    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);

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

    return (
        <React.Fragment>
            <div className="nav-container">
                <nav className="navbar">
                    <div className="nav-background">
                        <ul className="nav-list">
                            <li className={active === "home" ? "nav-item active" : "nav-item"}>
                                <Link to="/">Home</Link>
                            </li>

                            {/* Experience with dropdown */}
                            <li
                                ref={wrapperRef}
                                className={(active === "experience" ? "nav-item active" : "nav-item") + (open ? " open" : "")}
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
                                    {INFO.projects.map((p) => (
                                        <li key={p.slug} className="nav-dropdown-item">
                                            <Link to={`/project/${p.slug}`} onClick={() => setOpen(false)}>
                                                {p.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                            <li className="nav-item">
                                <a href="/resume.pdf" download target="_blank" rel="noreferrer">
                                    Resume
                                </a>
                            </li>

                            <li className={active === "contact" ? "nav-item active" : "nav-item"}>
                                <Link to="/contact">Contact</Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </React.Fragment>
    );
};

export default NavBar;
