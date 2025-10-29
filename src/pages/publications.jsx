import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import Footer from "../components/common/footer";
import NavBar from "../components/common/navBar";
import INFO from "../data/user";
import "./styles/publications.css";

const Publications = () => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<React.Fragment>
			<Helmet>
				<title>Publications</title>
				<meta name="description" content="Academic publications" />
			</Helmet>

			<div className="page-content">
				<NavBar active="publications" />
				<div className="content-wrapper">
					<div className="publications-container">
						<h1 className="publications-title">Publications</h1>

						<div className="publications-list">
							{(() => {
								// guard against duplicate entries in data: prefer unique by `id`, fallback to `title`
								const pubs = INFO.publications || [];
								const unique = Array.from(
									new Map(pubs.map((x) => [(x.id || x.title).toString(), x])).values()
								);
								return unique.map((p) => (
								<div className="publication-item" key={p.id}>
									<div className="publication-header">
										<div className="publication-title">{p.title}</div>
										<div className="publication-year">{p.year}</div>
									</div>

									<div className="publication-meta">{p.authors} &middot; {p.venue}</div>
									<div className="publication-abstract">{p.abstract}</div>

									{/* action buttons row - supports multiple links via `p.links` or a single `p.link` fallback */}
									{(() => {
										const raw = p.links || (p.link ? [p.link] : []);
										const normalized = (raw || [])
											.map((ln) => {
												if (!ln) return null;
												if (typeof ln === "string") return { href: ln, label: "View" };
												if (Array.isArray(ln)) return { href: ln[0], label: ln[1] || "View" };
												if (typeof ln === "object") return { href: ln.href || ln.link || null, label: ln.label || ln.title || "View" };
												return null;
											})
											.filter((x) => x && x.href && x.href.toString().trim() !== "");
										if (!normalized.length) return null;
										return (
											<div className="publication-actions">
												{normalized.map((ln, i) => (
													<a key={i} href={ln.href} target="_blank" rel="noreferrer" className="btn-mini">
														{ln.label}
													</a>
												))}
											</div>
										);
									})()}
								</div>
							));
						})()} 
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

export default Publications;
