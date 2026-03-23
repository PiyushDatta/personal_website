import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const {
  REACT_APP_GISCUS_CATEGORY,
  REACT_APP_GISCUS_CATEGORY_ID,
  REACT_APP_GISCUS_LANG,
  REACT_APP_GISCUS_REPO,
  REACT_APP_GISCUS_REPO_ID,
  REACT_APP_GISCUS_THEME,
} = process.env;

const giscusConfig = {
  category: REACT_APP_GISCUS_CATEGORY || 'Announcements',
  categoryId: REACT_APP_GISCUS_CATEGORY_ID || 'DIC_kwDODprAH84C5DWg',
  lang: REACT_APP_GISCUS_LANG || 'en',
  repo: REACT_APP_GISCUS_REPO || 'PiyushDatta/personal_website',
  repoId: REACT_APP_GISCUS_REPO_ID || 'R_kgDODprAHw',
  theme: REACT_APP_GISCUS_THEME || 'light',
};

const isPrerendering = typeof navigator !== 'undefined'
  && navigator.userAgent === 'ReactSnap';

const isConfigured = [
  giscusConfig.repo,
  giscusConfig.repoId,
  giscusConfig.category,
  giscusConfig.categoryId,
].every(Boolean);

const GiscusComments = ({ term }) => {
  const commentsRef = useRef(null);

  useEffect(() => {
    if (!isConfigured || isPrerendering || !commentsRef.current) {
      return undefined;
    }

    commentsRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-repo', giscusConfig.repo);
    script.setAttribute('data-repo-id', giscusConfig.repoId);
    script.setAttribute('data-category', giscusConfig.category);
    script.setAttribute('data-category-id', giscusConfig.categoryId);
    script.setAttribute('data-mapping', 'specific');
    script.setAttribute('data-term', term);
    script.setAttribute('data-strict', '1');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', giscusConfig.theme);
    script.setAttribute('data-lang', giscusConfig.lang);

    commentsRef.current.appendChild(script);

    return () => {
      if (commentsRef.current) {
        commentsRef.current.innerHTML = '';
      }
    };
  }, [term]);

  return (
    <section className="comments-section" aria-label="Comments">
      <h3>Comments</h3>
      {isConfigured && !isPrerendering ? (
        <div ref={commentsRef} className="giscus" />
      ) : (
        <p className="comments-note">
          Blog comments are configured through GitHub Discussions. If the widget
          does not load, verify that the <code>giscus</code> GitHub App is
          installed on this repository.
        </p>
      )}
    </section>
  );
};

GiscusComments.propTypes = {
  term: PropTypes.string.isRequired,
};

export default GiscusComments;
