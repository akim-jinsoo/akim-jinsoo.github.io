import React from "react";

import Project from "./project";

import INFO from "../../data/user";

import "./styles/allProjects.css";

const AllProjects = ({ mounted }) => {
	const projects = INFO.projects || [];
	const research = projects.filter((p) => p.category === "research");
	const internships = projects.filter((p) => p.category === "internship");
	const courses = projects.filter((p) => p.category === "course");

	const renderList = (items) => {
		if (!items || !items.length) return <div className="projects-empty">No projects yet.</div>;
		return (
			<div className="all-projects-grid">
				{items.map((project) => (
					<div className="all-projects-project" key={project.slug}>
						<Project
							slug={project.slug}
							logo={project.logo}
							title={project.title}
							description={project.description}
							linkText={project.linkText}
						/>
					</div>
				))}
			</div>
		);
	};

	return (
		<div className="all-projects-container grouped-projects">
                <section className="projects-section research-section">
                	<h2 className="projects-section-title">Research</h2>
				{renderList(research)}
			</section>

			<section className="projects-section internships-section">
                	<h2 className="projects-section-title">Internships</h2>
				{renderList(internships)}
			</section>

			<section className="projects-section courses-section">
                	<h2 className="projects-section-title">Course Projects</h2>
				{renderList(courses)}
			</section>
		</div>
	);
};

export default AllProjects;
