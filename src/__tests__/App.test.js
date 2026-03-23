/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import App from '../App';

describe('renders the app', () => {
  // mocks the fetch API used on the stats page and the about page.
  const textMock = jest.fn(() => Promise.resolve(''));
  global.fetch = jest.fn(() => Promise.resolve({ text: textMock }));
  // mocks the scrollTo API used when navigating to a new page.
  window.scrollTo = jest.fn();

  let container;

  beforeEach(async () => {
    container = document.createElement('div');
    document.body.appendChild(container);
    await act(async () => {
      await ReactDOM.createRoot(container).render(<App />);
    });
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
    jest.clearAllMocks();
  });

  it('should render the app', async () => {
    expect(document.body).toBeInTheDocument();
  });

  it('should render the title', async () => {
    expect(document.title).toBe('About | Piyush Datta');
  });

  it('can navigate to /about', async () => {
    expect.assertions(4);
    const aboutLink = document.querySelector('a[href="/about"]');
    expect(aboutLink).toBeInTheDocument();
    await act(async () => {
      await aboutLink.click();
    });
    expect(document.title).toContain('About |');
    expect(window.location.pathname).toBe('/about');
    expect(window.scrollTo).toHaveBeenNthCalledWith(1, 0, 0);
  });

  it('can navigate to /blog', async () => {
    expect.assertions(3);
    const blogLink = document.querySelector('a[href="/blog"]');
    expect(blogLink).toBeInTheDocument();
    await act(async () => {
      await blogLink.click();
    });
    expect(document.title).toContain('Blog |');
    expect(window.location.pathname).toBe('/blog');
  });

  it('can navigate to /blog/:slug', async () => {
    expect.assertions(4);
    const blogLink = document.querySelector('a[href="/blog"]');
    expect(blogLink).toBeInTheDocument();
    await act(async () => {
      await blogLink.click();
    });
    const postLink = document.querySelector(
      'a[href="/blog/launching-the-blog"]',
    );
    expect(postLink).toBeInTheDocument();
    await act(async () => {
      await postLink.click();
    });
    expect(document.title).toContain('Launching the blog |');
    expect(window.location.pathname).toBe('/blog/launching-the-blog');
  });

  it('can navigate to /resume', async () => {
    expect.assertions(3);
    const resumeLink = document.querySelector('a[href="/resume"]');
    expect(resumeLink).toBeInTheDocument();
    await act(async () => {
      await resumeLink.click();
    });
    expect(document.title).toContain('Resume |');
    expect(window.location.pathname).toBe('/resume');
  });

  it('can navigate to /contact', async () => {
    expect.assertions(3);
    const contactLink = document.querySelector('a[href="/contact"]');
    expect(contactLink).toBeInTheDocument();
    await act(async () => {
      await contactLink.click();
    });
    expect(document.title).toContain('Contact |');
    expect(window.location.pathname).toBe('/contact');
  });
});
