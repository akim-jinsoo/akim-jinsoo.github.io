import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Footer from "../components/common/footer";
import NavBar from "../components/common/navBar";
import Logo from "../components/common/logo";
import INFO from "../data/user";
import "./styles/publications.css";

const Publications = () => {
	const [mounted, setMounted] = useState(false);
	const renderAuthors = (publication) => {
		if (Array.isArray(publication?.authorsList) && publication.authorsList.length > 0) {
			const hasMany = publication.authorsList.length > 3;
			const shown = hasMany ? publication.authorsList.slice(0, 3) : publication.authorsList;
			const remaining = hasMany ? publication.authorsList.slice(3) : [];
			const remainingNames = remaining
				.map((a) => (typeof a === "string" ? a : a.name))
				.join(", ");
			return (
				<span
					className="publication-authors"
				>
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
					{hasMany ? (
						<>
							<span>, </span>
							<details className="publication-authors-dropdown">
								<summary className="publication-et-al">et al.</summary>
								{remainingNames ? (
									<span className="publication-authors-more">{remainingNames}</span>
								) : null}
							</details>
						</>
					) : ""}
				</span>
			);
		}

		if (publication?.authors) {
			return <span>{publication.authors}</span>;
		}

		return null;
	};
	useEffect(() => {
		window.scrollTo(0, 0);
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!mounted) return;

		const closeWithAnimation = (el) => {
			if (!el.open) return;
			el.classList.add('closing');
			el.removeAttribute('open');
			const content = el.querySelector('.publication-authors-more');
			if (content) {
				const onEnd = () => {
					el.classList.remove('closing');
					content.removeEventListener('animationend', onEnd);
				};
				content.addEventListener('animationend', onEnd);
				setTimeout(() => el.classList.remove('closing'), 250);
			} else {
				el.classList.remove('closing');
			}
		};

		// close others when one opens
		const handleToggle = (e) => {
			if (e.target.classList.contains('publication-authors-dropdown') && e.target.open) {
				document.querySelectorAll('.publication-authors-dropdown[open]').forEach(el => {
					if (el !== e.target) closeWithAnimation(el);
				});
			}
		};
		document.addEventListener('toggle', handleToggle, true);

		// animate manual close when user clicks an already-open et al.
		const handleSummaryClick = (e) => {
			const details = e.currentTarget.closest('.publication-authors-dropdown');
			if (details && details.open) {
				e.preventDefault();
				closeWithAnimation(details);
			}
		};
		const summaries = document.querySelectorAll('.publication-et-al');
		summaries.forEach(s => s.addEventListener('click', handleSummaryClick));

		return () => {
			document.removeEventListener('toggle', handleToggle, true);
			summaries.forEach(s => s.removeEventListener('click', handleSummaryClick));
		};
	}, [mounted]);

	useEffect(() => {
		if (!mounted) return;
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						entry.target.classList.add('scroll-visible');
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
		);
		document.querySelectorAll('.publication-item, .publications-year-heading').forEach(el => observer.observe(el));
		return () => observer.disconnect();
	}, [mounted]);

	return (
		<React.Fragment>
			<Helmet>
				<title>Publications</title>
				<meta name="robots" content="noindex" />
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
							Papers and articles I've authored or co-authored in academic journals and conferences. <span style={{ whiteSpace: 'nowrap' }}>There is more to come!</span>
						</div>

						<div className="publications-list">
							{(() => {
								const pubs = INFO.publications || [];
								const unique = Array.from(
									new Map(pubs.map((x) => [(x.id || x.title).toString(), x])).values()
								);
								const yearMap = {};
								unique.forEach(p => {
									const y = p.year || 'Other';
									if (!yearMap[y]) yearMap[y] = [];
									yearMap[y].push(p);
								});
								const years = Object.keys(yearMap).sort((a, b) => Number(b) - Number(a));

								return years.map(year => (
									<div className="publications-year-group" key={year}>
										<h2 className="publications-year-heading scroll-reveal">{year}</h2>
										{yearMap[year].map((p, i) => {
											const authorsNode = renderAuthors(p);
											const venueNode = p.venue ? <span>{p.venue}</span> : null;
											const raw = p.links || (p.link ? [p.link] : []);
											const links = raw.map((ln) => {
												if (!ln) return null;
												if (typeof ln === "string") return { href: ln, label: "View" };
												if (Array.isArray(ln)) return { href: ln[0], label: ln[1] || "View" };
												if (typeof ln === "object") return { href: ln.href || ln.link || null, label: ln.label || ln.title || "View" };
												return null;
											}).filter((x) => x && x.href && x.href.toString().trim() !== "");
											return (
												<div
													className="publication-item scroll-reveal"
													key={p.id || p.title}
													style={{ '--reveal-delay': `${80 + i * 220}ms` }}
												>
													<div className="publication-header">
														<div className="publication-title">{p.title}</div>
													</div>
													<div className="publication-meta">
														{authorsNode}
														{authorsNode && venueNode ? " · " : ""}
														{venueNode}
													</div>
													{links.length > 0 && (
														<div className="publication-actions">
															{links.map((ln, idx) => (
																<a key={idx} href={ln.href} target="_blank" rel="noreferrer" className="btn-mini">
																	{ln.label}
																</a>
															))}
														</div>
													)}
												</div>
											);
										})}
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
