const blogPosts = [
  {
    date: '2025-01-18',
    loadContent: () => import('./posts/launching-the-blog.md'),
    slug: 'launching-the-blog',
    summary:
      'Why this site now has a markdown-backed blog, what belongs here, and how comments are wired in.',
    title: 'Launching the blog',
  },
];

const sortedBlogPosts = [...blogPosts].sort(
  (left, right) => new Date(right.date) - new Date(left.date),
);

const getBlogPostBySlug = (slug) => (
  sortedBlogPosts.find((post) => post.slug === slug)
);

export { getBlogPostBySlug };
export default sortedBlogPosts;
