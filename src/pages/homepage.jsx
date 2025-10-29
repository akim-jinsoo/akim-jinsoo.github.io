import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";

import { faMailBulk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

import Logo from "../components/common/logo";
import Footer from "../components/common/footer";
import NavBar from "../components/common/navBar";
import About from "../components/homepage/about";
import Works from "../components/homepage/works";
import Education from "../components/homepage/education";

import INFO from "../data/user";
import SEO from "../data/seo";

import "./styles/homepage.css";

const Homepage = () => {
	const [stayLogo, setStayLogo] = useState(false);
	const [logoSize, setLogoSize] = useState(80);
	const [oldLogoSize, setOldLogoSize] = useState(80);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		window.scrollTo(0, 0);
		// trigger entrance animations
		setMounted(true);
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			let scroll = Math.round(window.pageYOffset, 2);

			let newLogoSize = 80 - (scroll * 4) / 10;

			if (newLogoSize < oldLogoSize) {
				if (newLogoSize > 40) {
					setLogoSize(newLogoSize);
					setOldLogoSize(newLogoSize);
					setStayLogo(false);
				} else {
					setStayLogo(true);
				}
			} else {
				setLogoSize(newLogoSize);
				setStayLogo(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [logoSize, oldLogoSize]);

	const currentSEO = SEO.find((item) => item.page === "home");

	const logoStyle = {
		display: "flex",
		position: stayLogo ? "fixed" : "relative",
		// align the (shrunk) logo vertically with the navbar pill
		// navbar top is 3vh and its height is 40px; we offset the logo so its center matches the nav center
		top: stayLogo ? `calc(3vh + ${(40 - Math.round(logoSize)) / 2}px)` : "auto",
		zIndex: 999,
		border: stayLogo ? "1px solid white" : "none",
		borderRadius: stayLogo ? "50%" : "none",
		boxShadow: stayLogo ? "0px 4px 10px rgba(0, 0, 0, 0.25)" : "none",
	};

	return (
		<React.Fragment>
			<Helmet>
				<title>{INFO.main.title}</title>
				<meta name="description" content={currentSEO.description} />
				<meta
					name="keywords"
					content={currentSEO.keywords.join(", ")}
				/>
			</Helmet>

			<div className="page-content">
				<NavBar active="home" />
				<div className="content-wrapper">
					<div className="homepage-logo-container">
						<div style={logoStyle} className={mounted ? "logo-float" : ""}>
							<Logo width={logoSize} link={false} />
						</div>
					</div>

					<div className="homepage-container">
						<div className="homepage-first-area">
								<div className="homepage-first-area-left-side">
									<div className={`title homepage-title ${mounted ? 'animate-fade-up' : ''}`}>
										{INFO.homepage.title}
									</div>

									<div
										className={`subtitle homepage-subtitle ${mounted ? 'animate-fade-up' : ''}`}
										style={{ animationDelay: mounted ? '120ms' : '0ms' }}
									>
										{INFO.homepage.description}
									</div>
								</div>

								<div className="homepage-first-area-right-side">
									<div className={`homepage-image-container ${mounted ? 'animate-fade-up' : ''}`} style={{ animationDelay: mounted ? '200ms' : '0ms' }}>
										<div className="homepage-image-wrapper">
											<img
												src="homepage.png"
												alt="about"
												className="homepage-image"
											/>
										</div>
									</div>
								</div>
							</div>

						<div className={`homepage-socials ${mounted ? 'animate-fade-up' : ''}`} style={{ animationDelay: mounted ? '500ms' : '0ms' }}>
							<a
								href={INFO.socials.github}
								target="_blank"
								rel="noreferrer"
							>
								<FontAwesomeIcon
									icon={faGithub}
									className={`homepage-social-icon ${mounted ? 'social-float' : ''}`}
								/>
							</a>
							<a
								href={INFO.socials.linkedin}
								target="_blank"
								rel="noreferrer"
							>
								<FontAwesomeIcon
									icon={faLinkedin}
									className={`homepage-social-icon ${mounted ? 'social-float' : ''}`}
								/>
							</a>
							<a
								href={`mailto:${INFO.main.email}`}
								target="_blank"
								rel="noreferrer"
							>
								<FontAwesomeIcon
									icon={faMailBulk}
									className={`homepage-social-icon ${mounted ? 'social-float' : ''}`}
								/>
							</a>
						</div>

						{/* Project section removed per request */}

						<div className="homepage-after-title">
							<div className={`animate-fade-up`} style={{ animationDelay: mounted ? "260ms" : "0ms" }}>
								<About />
							</div>

							<div className={`homepage-works animate-fade-up`} style={{ animationDelay: mounted ? "320ms" : "0ms" }}>
								<Works />
							</div>

							<div className={`animate-fade-up`} style={{ animationDelay: mounted ? "380ms" : "0ms" }}>
								<Education />
							</div>
						</div>

						<div className="page-footer">
							<Footer />
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Homepage;
