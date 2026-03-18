import React from "react";
import { Link } from "react-router-dom";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";

import Card from "../common/card";
import INFO from "../../data/user";

import "./styles/publications.css";

const Publications = () => {
	const renderAuthors = (publication) => {
		if (Array.isArray(publication?.authorsList) && publication.authorsList.length > 0) {
			const shown = publication.authorsList.slice(0, 2);
			const remaining = publication.authorsList.slice(2);
			const remainingCount = remaining.length;

			return (
				<span className="publication-authors-preview">
					{shown.map((a, idx) => {
						const name = typeof a === "string" ? a : a.name;
						const highlight = typeof a === "object" && a.highlight;
						return (
							<span key={`${name}-${idx}`}>
								{highlight ? <strong>{name}</strong> : name}
								{idx < shown.length - 1 ? ", " : ""}
							</span>
						);
					})}
					{remainingCount > 0 ? ` +${remainingCount} more` : ""}
				</span>
			);
		}

		if (publication?.authors) {
			return <span className="publication-authors-preview">{publication.authors}</span>;
		}

		return null;
	};

	const publications = (INFO.publications || []).slice(0, 3);

	return (
		<div className="homepage-publications">
			<Card
				icon={faBookmark}
				title="Publications"
				body={
					<div className="publications-body">
						{publications.map((publication) => (
							<div className="homepage-publication-item" key={publication.id || publication.title}>
								<div className="publication-item-header">
									<div className="publication-item-title">{publication.title}</div>
									<div className="publication-item-year">{publication.year}</div>
								</div>
								<div className="publication-item-authors">
									{renderAuthors(publication)}
								</div>
								{publication.venue && (
									<div className="publication-item-venue">
										<em>{publication.venue}</em>
									</div>
								)}
								{publication.links && publication.links.length > 0 && (
									<div className="publication-item-links">
										{publication.links.map((link, idx) => (
											<a
												key={idx}
												href={link.href}
												target="_blank"
												rel="noreferrer"
												className="publication-link"
											>
												{link.label}
											</a>
										))}
									</div>
								)}
							</div>
						))}
						<div className="publications-footer">
							<Link to="/publications" className="publications-link">
								view all publications
							</Link>
						</div>
					</div>
				}
			/>
		</div>
	);
};

export default Publications;
