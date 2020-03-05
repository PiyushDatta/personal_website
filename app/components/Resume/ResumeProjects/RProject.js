import React from 'react';
import PropTypes from 'prop-types';

const RProject = ({ data }) => (
  <article className="rprojects-container">
    <header>
      <h4><a href={data.link}>{data.projectname}</a></h4>
      <p className="tech"> {data.tech}</p>
    </header>
    <ul className="points">
      {data.points.map((point) => (
        <li key={point}>{point}</li>
      ))}
    </ul>
  </article>
);

RProject.propTypes = {
  data: PropTypes.shape({
    projectname: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    tech: PropTypes.string.isRequired,
    points: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default RProject;
