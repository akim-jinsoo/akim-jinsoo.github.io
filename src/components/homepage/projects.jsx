import React from "react";
import { Link } from "react-router-dom";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";

import Card from "../common/card";
import Project from "../projects/project";
import INFO from "../../data/user";

import "./styles/projects.css";

const Projects = () => {
	const projects = (INFO.projects || []).slice(0, 3);

	return (
		<div className="homepage-projects">
			<Card
				icon={faFolderOpen}
				title="Projects"
				body={
					<div className="projects-body">
						{projects.map((project) => (
							<div className="homepage-project-card" key={project.slug}>
								<Project
									slug={project.slug}
									logo={project.logo}
									title={project.title}
									description={project.description}
									linkText={project.linkText}
								/>
							</div>
						))}
						<div className="projects-footer">
							<Link to="/experience" className="projects-link">
								view all projects
							</Link>
						</div>
					</div>
				}
			/>
		</div>
	);
};

export default Projects;
