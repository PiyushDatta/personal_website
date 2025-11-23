import React from 'react';
import { Link } from 'react-router-dom';

import ContactIcons from '../Contact/ContactIcons';

const { PUBLIC_URL } = process.env; // set automatically from package.json:homepage

const SideBar = () => (
  <section id="sidebar">
    <section id="intro">
      <Link to="/" className="logo">
        <img src={`${PUBLIC_URL}/images/me.png`} alt="" />
      </Link>
      <header>
        <h2>Piyush Datta</h2>
        <p>
          <a href="mailto:piyushdattaca@gmail.com">piyushdattaca@gmail.com</a>
        </p>
      </header>
    </section>

    <section className="blurb">
      <h2>About</h2>
      <p>
        My name is Piyush (Pee-u-sh). I&apos;m a self-taught systems software
        engineer currently living and working in SF Bay Area. I&apos;ve worked on
        massive scale projects within database kernels and high performance
        infrastructure systems. My interests lie in distributed systems, ML/AI
        (main focus on sparse LLM architectures and RL), and cloud computing.
      </p>
      <ul className="actions">
        <li>
          {!window.location.pathname.includes('/resume') ? (
            <Link to="/resume" className="button">
              Learn More
            </Link>
          ) : (
            <Link to="/about" className="button">
              About Me
            </Link>
          )}
        </li>
      </ul>
    </section>

    <section id="footer">
      <ContactIcons />
      <p className="copyright">
        &copy; Piyush Datta <Link to="/">piyushdattaca@gmail.com</Link>.
      </p>
    </section>
  </section>
);

export default SideBar;
