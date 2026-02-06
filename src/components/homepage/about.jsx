import React from "react";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Card from "../common/card";
import INFO from "../../data/user";
import "./styles/about.css";

const About = () => {
  // Prefer `INFO.about` editable fields, fall back to existing fields when missing
  const about = INFO.about || {};
  const intro = about.intro || (INFO.homepage && INFO.homepage.description) || "";
  const paragraphs = about.paragraphs || [];

  return (
    <div className="homepage-about">
      <Card
        icon={faUser}
        title="About Me"
        body={
          <div className="about-body">
            <div className="about-paragraphs only-paragraphs">
              {paragraphs && paragraphs.length > 0 ? (
                paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))
              ) : (
                <p>{intro}</p>
              )}
            </div>
          </div>
        }
      />
    </div>
  );
};

export default About;
