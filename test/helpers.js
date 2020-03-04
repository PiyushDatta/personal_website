const randomString = (length) => {
  const x = 36 ** (length + 1);
  const y = 36 ** length;
  return Math.round(x - (Math.random() * y)).toString(36).slice(1);
};

const pages = [
  {
    route: '/',
    title: 'Piyush Datta',
    heading: 'ABOUT THIS SITE',
  },
  {
    route: '/about',
    title: 'About | Piyush Datta',
    heading: 'ABOUT ME',
  },
  {
    route: '/projects',
    title: 'Projects | Piyush Datta',
    heading: 'PROJECTS',
  },
  {
    route: '/stats',
    title: 'Stats | Piyush Datta',
    heading: 'STATS',
  },
  {
    route: '/contact',
    title: 'Contact | Piyush Datta',
    heading: 'CONTACT',
  },
];

export { pages, randomString };
