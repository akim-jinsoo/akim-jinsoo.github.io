import React from "react";
import { Link } from "react-router-dom";


import "./styles/project.css";

const Project = (props) => {
	const { slug, logo, title, description, externalLink } = props;

	/* Overlay text color is forced to white for consistency */

	return (
		<React.Fragment>
			<div className="project">
				<Link to={`/project/${slug}`}>
					<div className="project-container">
						<div
							className="project-logo"
							role="img"
							aria-label={title}
							style={{ backgroundImage: `url(${logo})` }}
						>
							<div className={`project-overlay dark`}>
								<div className="project-overlay-inner">
									<div className="project-title">{title}</div>
									<div className="project-description">{description}</div>
								</div>
							</div>
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
