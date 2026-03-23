import React from 'react';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

import Main from '../layouts/Main';
import posts from '../data/blog/posts';

const Blog = () => (
  <Main title="Blog" description="Writing by Piyush Datta.">
    <article className="post" id="blog">
      <header>
        <div className="title">
          <h2>
            <Link to="/blog">Blog</Link>
          </h2>
          <p>Longer-form writing, notes, and experiments.</p>
        </div>
      </header>

      <div className="blog-list">
        {posts.map((post) => (
          <article className="blog-card" key={post.slug}>
            <div className="blog-card-header">
              <div>
                <h3>
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p>{post.summary}</p>
              </div>
              <p className="blog-card-date">
                {dayjs(post.date).format('MMMM D, YYYY')}
              </p>
            </div>
            <ul className="actions">
              <li>
                <Link to={`/blog/${post.slug}`} className="button">
                  Read Post
                </Link>
              </li>
            </ul>
          </article>
        ))}
      </div>
    </article>
  </Main>
);

export default Blog;
