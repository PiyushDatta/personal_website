import React from 'react';
import dayjs from 'dayjs';
import Markdown from 'markdown-to-jsx';
import { Link, useParams } from 'react-router-dom';

import GiscusComments from '../components/Blog/GiscusComments';
import posts, { getBlogPostBySlug } from '../data/blog/posts';
import useMarkdown from '../hooks/useMarkdown';
import Main from '../layouts/Main';
import NotFound from './NotFound';
import { countWords, estimateReadingTime } from '../utils/markdown';

const BlogPost = () => {
  const { slug } = useParams();
  const post = getBlogPostBySlug(slug);
  const { error, markdown } = useMarkdown(post ? post.loadContent : null);

  if (!post) {
    return <NotFound />;
  }

  const wordCount = countWords(markdown);
  const readingTime = estimateReadingTime(wordCount);
  const currentPostIndex = posts.findIndex((entry) => entry.slug === slug);
  const nextPost = currentPostIndex > 0 ? posts[currentPostIndex - 1] : null;

  return (
    <Main title={post.title} description={post.summary}>
      <article className="post markdown blog-post" id={post.slug}>
        <header>
          <div className="title">
            <p className="eyebrow">
              <Link to="/blog">Blog</Link>
            </p>
            <h2>
              <Link to={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            <p>{post.summary}</p>
          </div>
          <div className="meta">
            <time className="published" dateTime={post.date}>
              {dayjs(post.date).format('MMMM D, YYYY')}
            </time>
            <span>{wordCount} words</span>
            <span>{readingTime} min read</span>
          </div>
        </header>

        {error ? (
          <p>Unable to load this post right now.</p>
        ) : (
          <Markdown>{markdown}</Markdown>
        )}

        <footer>
          <ul className="actions">
            <li>
              <Link to="/blog" className="button">
                All Posts
              </Link>
            </li>
            {nextPost ? (
              <li>
                <Link to={`/blog/${nextPost.slug}`} className="button">
                  Next Post
                </Link>
              </li>
            ) : null}
          </ul>
        </footer>
      </article>

      <GiscusComments term={post.slug} />
    </Main>
  );
};

export default BlogPost;
