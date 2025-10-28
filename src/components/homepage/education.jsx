import React from "react";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import Card from "../common/card";
import INFO from "../../data/user";
import "./styles/education.css";

const Education = () => {
    const items = INFO.education || [];
    const institutions = Array.from(new Set(items.map((i) => (i.institution || "").trim()))).filter(Boolean);

    return (
        <div className="homepage-education">
            <Card
                icon={faGraduationCap}
                title="Education"
                body={
                    <div className="education-body">
                        <div className="education-row">
                            {INFO.main && INFO.main.universityLogo ? (
                                <div className="education-logo">
                                    <img
                                        src={INFO.main.universityLogo}
                                        alt="University logo"
                                        className="card-university-logo"
                                    />
                                </div>
                            ) : null}

                            <div className="education-content">
                                {items.length > 0 ? (
                                    <>
                                        {institutions.length === 1 && (
                                            <div className="education-institution shared">{institutions[0]}</div>
                                        )}

                                        {items.map((edu, idx) => (
                                            <div className="education-item" key={idx}>
                                                <div className="education-header">
                                                    <div>
                                                        <div className="education-degree">{edu.degree}</div>
                                                        {edu.gpa && (
                                                            <div className="education-gpa">GPA: {edu.gpa}</div>
                                                        )}
                                                    </div>
                                                    <div className="education-duration">{edu.period}</div>
                                                </div>

                                                {/* Only show the institution per-item when there are multiple different institutions */}
                                                {institutions.length > 1 && (
                                                    <div className="education-institution">{edu.institution}</div>
                                                )}

                                                {edu.description && (
                                                    <div className="education-description">{edu.description}</div>
                                                )}

                                                {edu.awards && edu.awards.length > 0 && (
                                                    <ul className="education-awards">
                                                        {edu.awards.map((award, i) => (
                                                            <li key={i} className="education-award-item">{award}</li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <div className="education-empty">No education data configured.</div>
                                )}
                            </div>
                        </div>
                    </div>
                }
            />
        </div>
    );
};

export default Education;
