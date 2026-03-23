import React from 'react';
import { Link } from 'react-router-dom';
import Markdown from 'markdown-to-jsx';

import Main from '../layouts/Main';
import useMarkdown from '../hooks/useMarkdown';
import { countWords } from '../utils/markdown';

const loadAboutMarkdown = () => import('../data/about.md');

const About = () => {
  const { markdown } = useMarkdown(loadAboutMarkdown);
  const count = countWords(markdown);

  return (
    <Main title="About" description="Learn about Piyush Datta">
      <article className="post markdown" id="about">
        <header>
          <div className="title">
            <h2>
              <Link to="/about">About Me</Link>
            </h2>
            <p>(in about {count} words)</p>
          </div>
        </header>
        <Markdown>{markdown}</Markdown>
      </article>
    </Main>
  );
};

export default About;
