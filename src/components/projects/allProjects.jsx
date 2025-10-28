import React from "react";

import Project from "./project";

import INFO from "../../data/user";

import "./styles/allProjects.css";

const AllProjects = () => {
	return (
		<div className="all-projects-container">
			{INFO.projects.map((project) => (
				<div className="all-projects-project" key={project.slug}>
					<Project
						slug={project.slug}
						logo={project.logo}
						title={project.title}
						description={project.description}
						linkText={project.linkText}
						externalLink={project.link}
					/>
				</div>
			))}
		</div>
	);
};

export default AllProjects;
