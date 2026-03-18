import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import NavBar from "../components/common/navBar";
import Footer from "../components/common/footer";
import Logo from "../components/common/logo";

import INFO from "../data/user";
import SEO from "../data/seo";
import MarkupRenderer from "../components/common/MarkupRenderer";
import MARKUPS from "../data/projectMarkups";

import "./styles/projects.css";

const SECTION_SCROLL_OFFSET_PX = 112;

const ProjectDetail = () => {
    const { slug } = useParams();
    const [mounted, setMounted] = useState(false);
    const [externalMarkup, setExternalMarkup] = useState(null);
    const [loadingMarkup, setLoadingMarkup] = useState(false);
    const [markupError, setMarkupError] = useState(null);
    const [tocItems, setTocItems] = useState([]);
    const [activeTocId, setActiveTocId] = useState("");
    const [isSectionNavHidden, setIsSectionNavHidden] = useState(false);
    const [isSectionNavHovered, setIsSectionNavHovered] = useState(false);
    const detailBodyRef = useRef(null);
    const lastScrollYRef = useRef(0);

    useEffect(() => {
        window.scrollTo(0, 0);
        setMounted(true);
    }, []);

    const project = INFO.projects.find((p) => p.slug === slug && !p.hidden);
    const isAristo = project?.slug === "aristo";
    const isPlatoHand = project?.slug === "plato";
    const hasSectionNav = Boolean(project) && !isPlatoHand;
    const currentSEO = SEO.find((item) => item.page === "projects") || {};

    const [progress, setProgress] = useState(0);
    const [showProgress, setShowProgress] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            const el = document.querySelector('.project-detail-body');
            if (!el) {
                setProgress(0);
                setShowProgress(false);
                return;
            }

            const rect = el.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const elemTop = rect.top + scrollTop;
            const elemHeight = el.scrollHeight;

            let pct = 0;

            // determine whether to show the progress bar: only for content taller than the viewport
            const isLong = elemHeight > window.innerHeight;
            setShowProgress(isLong);

            if (isLong) {
                // long content: percent of scroll through the element
                const maxScroll = elemHeight - window.innerHeight;
                pct = (scrollTop - elemTop) / maxScroll;
            } else {
                // short content: do not show progress (we still compute pct as visible ratio but it won't render)
                const visible = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
                const visibleRatio = Math.max(0, visible) / Math.max(rect.height, 1);
                pct = visibleRatio;
            }

            pct = Math.min(Math.max(pct, 0), 1);
            setProgress(Math.round(pct * 100));
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        // initialize
        onScroll();
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, [slug, externalMarkup]);

    useEffect(() => {
        let mounted = true;
        setExternalMarkup(null);
        setMarkupError(null);
        if (project && project.longMarkupKey) {
            const key = project.longMarkupKey;
            const url = MARKUPS[key];
            if (url) {
                setLoadingMarkup(true);
                fetch(url)
                    .then((res) => {
                        if (!res.ok) throw new Error(`Failed to fetch markup: ${res.status}`);
                        return res.text();
                    })
                    .then((text) => {
                        if (mounted) setExternalMarkup(text);
                    })
                    .catch((err) => {
                        if (mounted) setMarkupError(err.message);
                    })
                    .finally(() => {
                        if (mounted) setLoadingMarkup(false);
                    });
            } else {
                if (mounted) setMarkupError(`No bundled markup found for key: ${key}`);
            }
        }
        return () => {
            mounted = false;
        };
    }, [project]);

    useEffect(() => {
        if (isPlatoHand) {
            const newTab = window.open("https://platohand.github.io/plato/", "_blank", "noopener,noreferrer");
            if (newTab) {
                newTab.opener = null;
            }
        }
    }, [isPlatoHand]);

    useEffect(() => {
        if (!isAristo) return;

        const blockContextMenu = (e) => {
            const container = document.querySelector(".project-detail-body");
            if (container && container.contains(e.target)) {
                e.preventDefault();
            }
        };

        const blockShortcuts = (e) => {
            const key = (e.key || "").toLowerCase();
            const cmdOrCtrl = e.metaKey || e.ctrlKey;
            if (!cmdOrCtrl) return;

            if (key === "s" || key === "p") {
                e.preventDefault();
                e.stopPropagation();
            }
        };

        document.addEventListener("contextmenu", blockContextMenu);
        window.addEventListener("keydown", blockShortcuts, true);

        return () => {
            document.removeEventListener("contextmenu", blockContextMenu);
            window.removeEventListener("keydown", blockShortcuts, true);
        };
    }, [isAristo]);

    useEffect(() => {
        if (!hasSectionNav || !detailBodyRef.current) {
            setTocItems([]);
            setActiveTocId("");
            return;
        }

        const headingNodes = Array.from(
            detailBodyRef.current.querySelectorAll(".markup-section, .markup-subsection")
        );

        if (!headingNodes.length) {
            setTocItems([]);
            setActiveTocId("");
            return;
        }

        const slugCounts = new Map();
        const items = headingNodes.map((node, index) => {
            const text = (node.textContent || "").trim();
            const level = node.classList.contains("markup-subsection") ? 3 : 2;
            const base = text
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, "")
                .trim()
                .replace(/\s+/g, "-") || `section-${index + 1}`;
            const seen = slugCounts.get(base) || 0;
            slugCounts.set(base, seen + 1);
            const id = seen ? `${base}-${seen + 1}` : base;
            node.id = id;
            node.style.scrollMarginTop = `${SECTION_SCROLL_OFFSET_PX}px`;
            return { id, text: text || `Section ${index + 1}`, level };
        });

        setTocItems(items);
        setActiveTocId((prev) => prev || items[0].id);

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

                if (visible.length) {
                    setActiveTocId(visible[0].target.id);
                }
            },
            {
                root: null,
                rootMargin: "-120px 0px -55% 0px",
                threshold: [0, 0.2, 0.5, 1],
            }
        );

        headingNodes.forEach((node) => observer.observe(node));

        return () => observer.disconnect();
    }, [hasSectionNav, externalMarkup, loadingMarkup, markupError, slug, mounted]);

    useEffect(() => {
        if (!hasSectionNav) {
            setIsSectionNavHidden(false);
            setIsSectionNavHovered(false);
            return;
        }

        lastScrollYRef.current = window.scrollY || 0;

        const onScroll = () => {
            const currentY = window.scrollY || 0;
            const delta = currentY - lastScrollYRef.current;

            if (currentY < 80) {
                setIsSectionNavHidden(false);
            } else if (delta > 8) {
                setIsSectionNavHidden(true);
            } else if (delta < -6) {
                setIsSectionNavHidden(false);
            }

            lastScrollYRef.current = currentY;
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [hasSectionNav, slug]);

    const handleTocClick = (id) => {
        const target = document.getElementById(id);
        if (!target) return;

        setActiveTocId(id);
        const targetTop = target.getBoundingClientRect().top + window.scrollY - SECTION_SCROLL_OFFSET_PX;
        window.scrollTo({ top: Math.max(targetTop, 0), behavior: "smooth" });

        if (window.history?.replaceState) {
            window.history.replaceState(null, "", `#${id}`);
        }
    };

    

    if (!project) {
        return (
            <div className="page-content">
                <NavBar active="experience" />
                <div className="content-wrapper">
                    <div className="projects-container">
                        <div className={`title projects-title ${mounted ? 'animate-fade-up' : ''}`}>Project not found</div>
                        <div className={`subtitle projects-subtitle ${mounted ? 'animate-fade-up' : ''}`} style={{ animationDelay: mounted ? '120ms' : '0ms' }}>
                            The project you are looking for does not exist.
                        </div>
                        <Link to="/experience">Back to Experience</Link>
                    </div>
                    <div className="page-footer">
                        <Footer />
                    </div>
                </div>
            </div>
        );
    }

    if (isPlatoHand) {
        return (
            <React.Fragment>
                <Helmet>
                    <title>{`PLATO Hand | ${INFO.main.title}`}</title>
                    <meta name="description" content="Redirecting to the PLATO Hand project site." />
                </Helmet>
                <div className="page-content">
                    <NavBar active="experience" />
                    <div className="content-wrapper">
                        <div className="projects-container">
                            <div className={`title projects-title ${mounted ? 'animate-fade-up' : ''}`}>Redirecting…</div>
                            <div className={`subtitle projects-subtitle ${mounted ? 'animate-fade-up' : ''}`} style={{ animationDelay: mounted ? '120ms' : '0ms' }}>
                                Opening the PLATO Hand project site.
                            </div>
                            <p>
                                If you are not redirected, visit <a href="https://platohand.github.io/plato/">https://platohand.github.io/plato/</a>.
                            </p>
                            <p>
                                <Link to="/experience" className="back-button">Back to Experience</Link>
                            </p>
                        </div>
                        <div className="page-footer">
                            <Footer />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>{`${project.title} | ${INFO.main.title}`}</title>
                <meta name="description" content={project.description || currentSEO.description} />
            </Helmet>

            <div className="page-content">
                <NavBar active="experience" />
                <div className="content-wrapper">
                    <div className="projects-logo-container">
                        <div className={`projects-logo ${mounted ? 'logo-float' : ''}`}>
                            <Logo width={46} />
                        </div>
                    </div>

                    <div className="projects-container">
                        {/* progress bar (only show for long content) */}
                        {showProgress && (
                            <div className="project-progress-wrapper" aria-hidden="true">
                                <div className="project-progress" style={{ width: `${progress}%` }} />
                            </div>
                        )}

                        <div className={`title projects-title ${mounted ? 'animate-fade-up' : ''}`}>{project.title}</div>
                        <div className={`subtitle projects-subtitle ${mounted ? 'animate-fade-up' : ''}`} style={{ animationDelay: mounted ? '120ms' : '0ms' }}>{project.description}</div>

                        <div className="project-detail-layout">
                            {hasSectionNav && tocItems.length > 0 ? (
                                <aside
                                    className={`project-section-nav ${isSectionNavHidden && !isSectionNavHovered ? 'is-hidden' : ''}`}
                                    aria-label="Section navigation"
                                    onMouseEnter={() => setIsSectionNavHovered(true)}
                                    onMouseLeave={() => setIsSectionNavHovered(false)}
                                    onFocusCapture={() => setIsSectionNavHovered(true)}
                                    onBlurCapture={(event) => {
                                        if (!event.currentTarget.contains(event.relatedTarget)) {
                                            setIsSectionNavHovered(false);
                                        }
                                    }}
                                >
                                    <div className="project-section-nav-title">On this page</div>
                                    <ul className="project-section-nav-list">
                                        {tocItems.map((item) => (
                                            <li key={item.id} className={`project-section-nav-item ${item.level === 3 ? 'is-subsection' : ''}`}>
                                                <button
                                                    type="button"
                                                    className={`project-section-nav-link ${activeTocId === item.id ? 'active' : ''}`}
                                                    onClick={() => handleTocClick(item.id)}
                                                >
                                                    {item.text}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </aside>
                            ) : null}

                            <div ref={detailBodyRef} className={`project-detail-body ${mounted ? 'animate-fade-up' : ''}`} style={{ animationDelay: mounted ? '200ms' : '0ms' }}>
                                {loadingMarkup ? (
                                    <p>Loading project content...</p>
                                ) : markupError ? (
                                    <div>
                                        <p>Failed to load project content.</p>
                                        <pre style={{ color: "#a00" }}>{markupError}</pre>
                                        {project.longDescription ? (
                                            <div dangerouslySetInnerHTML={{ __html: project.longDescription }} />
                                        ) : null}
                                    </div>
                                ) : externalMarkup ? (
                                    <MarkupRenderer content={externalMarkup} />
                                ) : project.longMarkup ? (
                                    <MarkupRenderer content={project.longMarkup} />
                                ) : project.longDescription ? (
                                    <div dangerouslySetInnerHTML={{ __html: project.longDescription }} />
                                ) : (
                                    <div>
                                        <p>This project does not have a long description yet.</p>
                                    </div>
                                )}

                                <p>
                                    <Link to="/experience" className="back-button">Back to Experience</Link>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="page-footer">
                        <Footer />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default ProjectDetail;
