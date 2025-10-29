import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

import NavBar from "../components/common/navBar";
import Footer from "../components/common/footer";
import Logo from "../components/common/logo";
import AllProjects from "../components/projects/allProjects";

import INFO from "../data/user";
import SEO from "../data/seo";

import "./styles/projects.css";

const Experience = () => {
	const [mounted, setMounted] = useState(false);
	const fullTitle = "All of my internship, research, and course project experiences displayed here.";
	const [typedTitle, setTypedTitle] = useState("");

	useEffect(() => {
		window.scrollTo(0, 0);
		setMounted(true);
	}, []);

	// typing effect for the title
	useEffect(() => {
		if (!mounted) return;

		const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prefersReduced) {
			setTypedTitle(fullTitle);
			return;
		}

		let idx = 0;
		const speed = 24; // ms per character
		const timer = setInterval(() => {
			idx += 1;
			setTypedTitle(fullTitle.slice(0, idx));
			if (idx >= fullTitle.length) {
				clearInterval(timer);
			}
		}, speed);

		return () => clearInterval(timer);
	}, [mounted]);

	const currentSEO = SEO.find((item) => item.page === "projects");

	return (
		<React.Fragment>
			<Helmet>
				<title>{`Experience | ${INFO.main.title}`}</title>
				<meta name="description" content={currentSEO.description} />
				<meta
					name="keywords"
					content={currentSEO.keywords.join(", ")}
				/>
			</Helmet>

				<div className="page-content">
					<NavBar active="experience" />
				<div className="content-wrapper">
					<div className="projects-logo-container">
						<div className={`projects-logo ${mounted ? "logo-float" : ""}`}>
							<Logo width={46} />
						</div>
					</div>
					<div className="projects-container">
						<div className={`title projects-title ${mounted ? "animate-fade-up" : ""}`}>
							<span className="projects-title-text">{typedTitle}</span>
							<span className="typing-caret" aria-hidden="true" />
						</div>

						<div className={`subtitle projects-subtitle ${mounted ? "animate-fade-up" : ""}`} style={{ animationDelay: mounted ? "120ms" : "0ms" }}>
							I've worked on a variety of projects over the years, gaining experience that has shaped my approach to engineering and research. My current focus is on robotic manipulation and mechanical design, while I continue to expand into artificial intelligence and machine learning to enhance perception and control in robotics. WARNING: !!!Underdevelopment!!! In the process of switching to a new portfolio format, some projects may be temporarily be incomplete.
 						</div>

						<div className={`projects-list ${mounted ? "animate-fade-up" : ""}`} style={{ animationDelay: mounted ? "200ms" : "0ms" }}>
							<AllProjects mounted={mounted} />
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

export default Experience;
