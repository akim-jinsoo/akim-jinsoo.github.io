import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Footer from "../components/common/footer";
import NavBar from "../components/common/navBar";
import Logo from "../components/common/logo";
import INFO from "../data/user";
import "./styles/publications.css";

const Publications = () => {
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		window.scrollTo(0, 0);
		setMounted(true);
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
					<div className="publications-logo-container">
						<div className={`publications-logo ${mounted ? 'logo-float' : ''}`}>
							<Logo width={46} />
						</div>
					</div>
					<div className="publications-container">
						<div className={`title publications-title ${mounted ? 'animate-fade-up' : ''}`} style={{ animationDelay: mounted ? '0ms' : '0ms' }}>Publications</div>

						<div className={`subtitle publications-subtitle ${mounted ? 'animate-fade-up' : ''}`} style={{ animationDelay: mounted ? '120ms' : '0ms' }}>
							Papers and articles I've authored or co-authored in academic journals and conferences. There is more to come!
						</div>

						<div className={`publications-list ${mounted ? 'animate-fade-up' : ''}`} style={{ animationDelay: mounted ? '200ms' : '0ms' }}>
							{(() => {
								// guard against duplicate entries in data: prefer unique by `id`, fallback to `title`
								const pubs = INFO.publications || [];
								const unique = Array.from(
									new Map(pubs.map((x) => [(x.id || x.title).toString(), x])).values()
								);
								return unique.map((p, i) => (
								<div className={`publication-item ${mounted ? 'animate-fade-up' : ''}`} style={{ animationDelay: mounted ? `${300 + i * 80}ms` : '0ms' }} key={p.id || p.title}>
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
												{normalized.map((ln, idx) => (
													<a key={idx} href={ln.href} target="_blank" rel="noreferrer" className="btn-mini">
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
