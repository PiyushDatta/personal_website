import React from 'react';
import { Link } from 'react-router-dom';

import Main from '../layouts/Main';

import Education from '../components/Resume/Education';
import Experience from '../components/Resume/Experience';
import Projects from '../components/Resume/ResumeProjects';
// import Skills from '../components/Resume/Skills';
// import Courses from '../components/Resume/Courses';
import References from '../components/Resume/References';

// import courses from '../data/resume/courses';
import works from '../data/resume/work';
import degrees from '../data/resume/degrees';
import resumeProjects from '../data/resume/resumeprojects';

// import { skills, categories } from '../data/resume/skills';

// NOTE: sections are displayed in order defined.
const sections = {
  Experience: () => <Experience data={works} />,
  Projects: () => <Projects data={resumeProjects} />,
  Education: () => <Education data={degrees} />,
  // Skills: () => <Skills skills={skills} categories={categories} />,
  // Courses: () => <Courses data={courses} />,
  References: () => <References />,
};

const Resume = () => (
  <Main title="Resume" description="Piyush Datta's Resume.">
    <article className="post" id="resume">
      <header>
        <div className="title">
          <h2>
            <Link to="resume">Resume</Link>&nbsp;&nbsp;
            <a href="/resumes/piyush_datta_resume.pdf">(PDF Version)</a>
          </h2>
          <div className="link-container">
            {Object.keys(sections).map((sec) => (
              <h4 key={sec}>
                <a href={`#${sec.toLowerCase()}`}>{sec}</a>
              </h4>
            ))}
          </div>
        </div>
      </header>
      {Object.entries(sections).map(([name, Section]) => (
        <Section key={name} />
      ))}
    </article>
  </Main>
);

export default Resume;
