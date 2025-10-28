import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";

import "./styles/project.css";

const Project = (props) => {
	const { slug, logo, title, description, linkText, externalLink } = props;

	return (
		<React.Fragment>
			<div className="project">
				<Link to={`/project/${slug}`}>
					<div className="project-container">
						<div className="project-logo">
							<img src={logo} alt="logo" />
						</div>
						<div className="project-title">{title}</div>
						<div className="project-description">{description}</div>
						<div className="project-link">
							<div className="project-link-icon">
								<FontAwesomeIcon icon={faLink} />
							</div>

							<div className="project-link-text">{linkText}</div>
						</div>
					</div>
				</Link>
				{/* Secondary external link (opens in new tab) */}
				{externalLink && (
					<div className="project-external-link">
						<a href={externalLink} target="_blank" rel="noreferrer">
							Visit
						</a>
					</div>
				)}
			</div>
		</React.Fragment>
	);
};

export default Project;
