import React from "react";
import { Link } from "react-router-dom";
import Helmet from "react-helmet";

import Main from "../layouts/Main";

import Education from "../components/Resume/Education";
import Experience from "../components/Resume/Experience";
import Projects from "../components/Resume/ResumeProjects";
import Skills from "../components/Resume/Skills";
import Courses from "../components/Resume/Courses";
import References from "../components/Resume/References";

import courses from "../data/resume/courses";
import degrees from "../data/resume/degrees";
import positions from "../data/resume/positions";
import resumeProjects from "../data/resume/resumeprojects";
import { skills, categories } from "../data/resume/skills";

// resume
import resumePDF from "../../public/other/piyush_datta_resume.pdf";

const sections = [
  "Education",
  "Experience",
  "Projects"
  // 'Skills',
  // 'Courses',
  // 'References',
];

const Resume = () => (
  <Main>
    <Helmet title="Resume" />
    <article className="post" id="resume">
      <header>
        <div className="title">
          <h2>
            <Link to="resume">Resume</Link>&nbsp;&nbsp;
            <a href={resumePDF}>(PDF Version)</a>
          </h2>

          <div className="link-container">
            <br></br>
            {sections.map(sec => (
              <h4 key={sec}>
                <a href={`#${sec.toLowerCase()}`}>{sec}</a>
              </h4>
            ))}
          </div>
        </div>
      </header>
      <Education data={degrees} />
      <Experience data={positions} />
      <Projects data={resumeProjects} />
      {/* <Skills skills={skills} categories={categories} /> */}
      {/* <Courses data={courses} /> */}
      <References />
    </article>
  </Main>
);

export default Resume;
