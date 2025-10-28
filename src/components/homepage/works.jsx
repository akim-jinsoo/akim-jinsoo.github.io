import React from "react";
import { faBriefcase } from "@fortawesome/free-solid-svg-icons";

import Card from "../common/card";

import "./styles/works.css";

const Works = () => {
	return (
		<div className="works">
			<Card
				icon={faBriefcase}
				title="Work"
				body={
					<div className="works-body">
						<div className="work">
							<img
								src="./facebook.png"
								alt="hcrl"
								className="work-image"
							/>
							<div className="work-content">
								<div className="work-header">
									<div className="work-title">Human Centered Robotics Lab</div>
									<div className="work-duration">August 2024 - Present</div>
								</div>
								<div className="work-subtitle">Graduate Student Fellow</div>
							</div>
						</div>

						<div className="work">
							<img
								src="./twitter.png"
								alt="sony"
								className="work-image"
							/>
							<div className="work-content">
								<div className="work-header">
									<div className="work-title">Sony Corporation – Fundamental Robotics Lab, Tokyo, Japan</div>
									<div className="work-duration">May 2024 - August 2024</div>
								</div>
								<div className="work-subtitle">Research Intern</div>
							</div>
						</div>

						<div className="work">
							<img
								src="./twitter.png"
								alt="hcrl"
								className="work-image"
							/>
							<div className="work-content">
								<div className="work-header">
									<div className="work-title">Human Centered Robotics Lab</div>
									<div className="work-duration">January 2023 - May 2024</div>
								</div>
								<div className="work-subtitle">Undergraduate Researcher</div>
							</div>
						</div>

						<div className="work">
							<img
								src="./twitter.png"
								alt="hero"
								className="work-image"
							/>
							<div className="work-content">
								<div className="work-header">
									<div className="work-title">Human-Enabled Robotics Technology Lab</div>
									<div className="work-duration">August 2021 - December 2022</div>
								</div>
								<div className="work-subtitle">Undergraduate Researcher</div>
							</div>
						</div>

						<div className="work">
							<img
								src="./twitter.png"
								alt="hero"
								className="work-image"
							/>
							<div className="work-content">
								<div className="work-header">
									<div className="work-title">Samsung Austin Semiconductor</div>
									<div className="work-duration">May 2022 - August 2022</div>
								</div>
								<div className="work-subtitle">Engineering Intern</div>
							</div>
						</div>

					</div>
				}
			/>
		</div>
	);
};

export default Works;
