import React from 'react';
import PropTypes from 'prop-types';

import RProject from './ResumeProjects/RProject';

const ResumeProjects = ({ data }) => (
  <div className="projects">
    <div className="link-to" id="projects" />
    <div className="title">
      <h3>Projects</h3>
    </div>
    {data.map((project) => (
      <RProject
        data={project}
        key={project.projectname}
      />
    ))}
  </div>
);

ResumeProjects.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    company: PropTypes.string,
    position: PropTypes.string,
    link: PropTypes.string,
    daterange: PropTypes.string,
    points: PropTypes.arrayOf(PropTypes.string),
  })),
};

ResumeProjects.defaultProps = {
  data: [],
};


export default ResumeProjects;
