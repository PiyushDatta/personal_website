const blogPosts = [
  {
    date: '2026-03-22',
    loadContent: () => import('./posts/launching_the_blog.md'),
    slug: 'launching_the_blog',
    title: 'First post - Launching the blog',
  },
];

const sortedBlogPosts = [...blogPosts].sort(
  (left, right) => new Date(right.date) - new Date(left.date),
);

const getBlogPostBySlug = (slug) => sortedBlogPosts.find((post) => post.slug === slug);

export { getBlogPostBySlug };
export default sortedBlogPosts;
