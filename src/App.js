import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import ReactGA from "react-ga4";

import Homepage from "./pages/homepage";
import SplashGate from "./pages/SplashGate";
import Experience from "./pages/projects";
import { Navigate } from "react-router-dom";
import ProjectDetail from "./pages/projectDetail";
import Notfound from "./pages/404";
import Publications from "./pages/publications";

import { TRACKING_ID } from "./data/tracking";
import "./app.css";

function App() {
	useEffect(() => {
		if (TRACKING_ID !== "") {
			ReactGA.initialize(TRACKING_ID);
		}
	}, []);

	return (
		<div className="App">
				<Routes>
					<Route path="/" element={
						<SplashGate>
							<Homepage />
						</SplashGate>
					} />
				<Route path="/projects" element={<Navigate to="/experience" replace />} />
				<Route path="/experience" element={<Experience />} />
				<Route path="/project/:slug" element={<ProjectDetail />} />
				<Route path="/publications" element={<Publications />} />

				<Route path="*" element={<Notfound />} />
			</Routes>
		</div>
	);
}

export default App;
