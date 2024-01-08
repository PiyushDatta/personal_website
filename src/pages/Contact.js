import React from 'react';
import { Link } from 'react-router-dom';

import Main from '../layouts/Main';
// import EmailLink from '../components/Contact/EmailLink';
import ContactIcons from '../components/Contact/ContactIcons';

const Contact = () => (
  <Main
    title="Contact"
    description="Contact Piyush via email @ piyushdattaca@gmail.com"
  >
    <article className="post" id="contact">
      <header>
        <div className="title">
          <h2>
            <Link to="/contact">Contact</Link>
          </h2>
        </div>
      </header>
      <div className="email-at">
        <p>Feel free to get in touch.</p>
        <p>
          Email:{' '}
          <a href="mailto:piyushdattaca@gmail.com">piyushdattaca@gmail.com</a>
        </p>
        <p>
          Linkedin:{' '}
          <a href="https://ca.linkedin.com/in/piyushdatta">
            https://ca.linkedin.com/in/piyushdatta
          </a>
        </p>
        <p>
          Github:{' '}
          <a href="https://github.com/PiyushDatta">
            https://github.com/PiyushDatta
          </a>
        </p>
        <p>
          Repository for this site:{' '}
          <a href="https://github.com/PiyushDatta/personal_website">
            https://github.com/PiyushDatta/personal_website
          </a>
        </p>
        {/* <div
            className="inline-container"
            style={validateText(message) ? {} : { color: 'red' }}
            onMouseEnter={() => setIsActive(false)}
            onMouseLeave={() => (idx < messages.length) && setIsActive(true)}
          >
            <a href={validateText(message) ? `mailto:${message}@gmail.com` : ''}>
              <span>{message}</span>
              <span>@gmail.com</span>
            </a>
          </div> */}
      </div>
      <ContactIcons />
    </article>
  </Main>
);

export default Contact;
