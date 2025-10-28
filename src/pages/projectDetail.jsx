import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import NavBar from "../components/common/navBar";
import Footer from "../components/common/footer";
import Logo from "../components/common/logo";

import INFO from "../data/user";
import SEO from "../data/seo";
import MarkupRenderer from "../components/common/MarkupRenderer";

import "./styles/projects.css";

const ProjectDetail = () => {
    const { slug } = useParams();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const project = INFO.projects.find((p) => p.slug === slug);
    const currentSEO = SEO.find((item) => item.page === "projects") || {};

    if (!project) {
        return (
            <div className="page-content">
                <NavBar active="experience" />
                <div className="content-wrapper">
                    <div className="projects-container">
                        <div className="title projects-title">Project not found</div>
                        <div className="subtitle projects-subtitle">
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
                        <div className="projects-logo">
                            <Logo width={46} />
                        </div>
                    </div>

                    <div className="projects-container">
                        <div className="title projects-title">{project.title}</div>
                        <div className="subtitle projects-subtitle">{project.description}</div>

                        <div className="project-detail-body">
                            {project.longMarkup ? (
                                <MarkupRenderer content={project.longMarkup} />
                            ) : project.longDescription ? (
                                <div dangerouslySetInnerHTML={{ __html: project.longDescription }} />
                            ) : (
                                <div>
                                    <p>This project does not have a long description yet.</p>
                                </div>
                            )}

                            <p>
                                <Link to="/experience">Back to Experience</Link> //TODO Make this into a button using back-button.png
                            </p>
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
