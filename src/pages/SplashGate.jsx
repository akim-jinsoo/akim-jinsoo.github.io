import React, { useEffect, useState, useRef } from "react";
import Logo from "../components/common/logo";
import NavBar from "../components/common/navBar";
import INFO from "../data/user";
import "./styles/splash.css";

const SplashGate = ({ children }) => {
  const [seen, setSeen] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Typing animation state (hooks must be declared unconditionally)
  const titleFull = INFO.homepage.title || "";
  const subtitleFull = "Welcome to my personal website.";
  const [typedTitle, setTypedTitle] = useState("");
  const [typedSubtitle, setTypedSubtitle] = useState("");
  const typingTimers = useRef([]);
  const [phase, setPhase] = useState("idle"); // idle -> preblink -> typingTitle -> postTitleBlink -> preblinkSubtitle -> typingSubtitle -> done
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // determine whether user has seen the splash before
    // use sessionStorage so closing the browser clears the flag
    try {
      const s = sessionStorage.getItem("seenSplash");
      if (!s) setSeen(false);
    } catch (e) {
      // storage might be unavailable; default to not seen
      setSeen(false);
    }
    setMounted(true);
  }, []);

  // decide initial phase when splash is visible
  useEffect(() => {
    if (!mounted) return;
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setTypedTitle(titleFull);
      setTypedSubtitle(subtitleFull);
      setPhase('done');
      return;
    }
    if (!seen && phase === 'idle') {
      setPhase('preblink');
    }
  }, [mounted, seen, phase, titleFull, subtitleFull]);

  // typing engine driven by phase
  useEffect(() => {
    const clearAll = () => {
      typingTimers.current.forEach((id) => clearTimeout(id));
      typingTimers.current = [];
    };

    if (!mounted || seen) return () => {};

    if (phase === 'typingTitle') {
      let idx = 0;
      const step = () => {
        if (idx <= titleFull.length) {
          setTypedTitle(titleFull.slice(0, idx));
          idx += 1;
          const t = setTimeout(step, 65); // 10% faster than 72ms
          typingTimers.current.push(t);
        } else {
          setPhase('postTitleBlink');
        }
      };
      step();
    }

    if (phase === 'typingSubtitle') {
      let sidx = 0;
      const step2 = () => {
        if (sidx <= subtitleFull.length) {
          setTypedSubtitle(subtitleFull.slice(0, sidx));
          sidx += 1;
          const t2 = setTimeout(step2, 52); // 10% faster than 58ms
          typingTimers.current.push(t2);
        } else {
          setPhase('done');
        }
      };
      step2();
    }

    return clearAll;
  }, [phase, mounted, seen, titleFull, subtitleFull]);

  const handleEnter = () => {
    try {
      sessionStorage.setItem("seenSplash", "1");
      // when moving from the splash into the homepage, skip the homepage title animation
      sessionStorage.setItem("skipHomeTitleAnimation", "1");
      // mark that we are coming from splash so homepage can adjust animations
      sessionStorage.setItem("fromSplash", "1");
    } catch (e) {}
    // Use a more immediate approach - navigate with a flag
    window.location.href = '/?fromSplash=1';
  };

  const handleBackdropClick = (e) => {
    // Ignore clicks on the theme toggle button
    if (e.target && typeof e.target.closest === 'function') {
      const isThemeToggle = e.target.closest('.theme-toggle');
      if (isThemeToggle) return;
    }
    if (exiting) return;
    setExiting(true);
    // allow exit animation to play before entering
    setTimeout(() => {
      handleEnter();
    }, 600);
  };

  // If we haven't mounted yet, avoid rendering flicker
  if (!mounted) return null;

  if (seen) return children;

  // Render a simplified copy of the homepage hero so the title/logo align
  const logoStyle = {
    display: "flex",
    position: "relative",
    zIndex: 999,
  };

  // Typing animation (state/hooks declared above)
  // Compute split of the title to isolate "Hello!" for periodic bounce
  const helloText = "Hello!";
  const helloLen = helloText.length;
  let helloPart = "";
  let restPart = typedTitle;
  let showHelloAnim = false;
  if ((titleFull || "").startsWith(helloText)) {
    const cut = Math.min(typedTitle.length, helloLen);
    helloPart = typedTitle.slice(0, cut);
    restPart = typedTitle.slice(cut);
    // Only activate the bounce after the entire typing sequence finishes
    showHelloAnim = (phase === 'done') && (typedTitle.length >= helloLen);
  }


  return (
  <div className={`page-content splash-page-content ${exiting ? 'splash-exit' : ''}`} role="dialog" aria-modal="true" onClick={handleBackdropClick}>
      <NavBar active="home" />

      <div className="content-wrapper">
        <div className="homepage-logo-container">
          <div style={logoStyle} className={`logo-float`}>
            <Logo width={80} link={false} />
          </div>
        </div>

        <div className="homepage-container">
          <div className="homepage-first-area">
            <div className="homepage-first-area-left-side">
              <div className={`title homepage-title`}>
                <span className="typing">
                  {helloPart ? (
                    <>
                      <span className={showHelloAnim ? 'hello-bounce' : ''}>{helloPart}</span>
                      {restPart}
                    </>
                  ) : (
                    typedTitle
                  )}
                  {phase === 'preblink' && (
                    <span
                      className="caret caret-blink-2 caret-at-start"
                      onAnimationEnd={() => setPhase('typingTitle')}
                      aria-hidden="true"
                    />
                  )}
                  {phase === 'typingTitle' && (
                    <span
                      className={`caret ${typedTitle.length === 0 ? 'caret-at-start' : ''}`}
                      aria-hidden="true"
                    />
                  )}
                  {phase === 'postTitleBlink' && (
                    <span
                      className="caret caret-blink-1"
                      onAnimationEnd={() => setPhase('preblinkSubtitle')}
                      aria-hidden="true"
                    />
                  )}
                </span>
              </div>

              <div className={`subtitle homepage-subtitle`}>
                <span className="typing">
                  {typedSubtitle}
                  {phase === 'preblinkSubtitle' && (
                    <span
                      className="caret caret-blink-1 caret-at-start"
                      onAnimationEnd={() => setPhase('typingSubtitle')}
                      aria-hidden="true"
                    />
                  )}
                  {phase === 'typingSubtitle' && (
                    <span
                      className={`caret ${typedSubtitle.length === 0 ? 'caret-at-start' : ''}`}
                      aria-hidden="true"
                    />
                  )}
                  {phase === 'done' && (
                    <span className="caret caret-blink" aria-hidden="true" />
                  )}
                </span>
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
          {/* Clicking anywhere on the splash (except the theme toggle) will enter */}
          {phase === 'done' && (
            <div className="splash-continue-hint" aria-hidden="true">click to continue</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SplashGate;
